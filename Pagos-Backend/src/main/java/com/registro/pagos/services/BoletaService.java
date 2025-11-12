package com.registro.pagos.services;

import com.registro.pagos.dto.BoletaRequest;
import com.registro.pagos.dto.DetalleRequest;
import com.registro.pagos.exception.ResourceNotFoundException;
import com.registro.pagos.exception.InvalidOperationException;
import com.registro.pagos.models.Boleta;
import com.registro.pagos.models.Concepto;
import com.registro.pagos.models.DetalleBoleta;
import com.registro.pagos.models.EstadoBoleta;
import com.registro.pagos.repository.BoletaRepository;
import com.registro.pagos.repository.ConceptoRepository;
import com.registro.pagos.repository.DetalleBoletaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BoletaService {

    private final BoletaRepository boletaRepository;
    private final ConceptoRepository conceptoRepository;
    private final DetalleBoletaRepository detalleRepository;

    public BoletaService(BoletaRepository boletaRepository,
                         ConceptoRepository conceptoRepository,
                         DetalleBoletaRepository detalleRepository) {
        this.boletaRepository = boletaRepository;
        this.conceptoRepository = conceptoRepository;
        this.detalleRepository = detalleRepository;
    }

    public Boleta getById(Long id) {
        return boletaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta no encontrada: " + id));
    }

    @Transactional
    public Boleta createBoleta(BoletaRequest req, String dniEncargado) {
        if (req == null) throw new InvalidOperationException("Request boleta vacío");
        Boleta boleta = new Boleta();
        boleta.setNombre(req.getNombre());
        boleta.setDireccion(req.getDireccion());
        boleta.setFechaEmision(req.getFechaEmision() != null ? req.getFechaEmision() : LocalDate.now());
        boleta.setDocumentoIdentidad(req.getDocumentoIdentidad());
        if (dniEncargado != null && !dniEncargado.isBlank()) {
            boleta.setDniEncargado(dniEncargado);
        } else if (req.getDniEncargado() != null && !req.getDniEncargado().isBlank()) {
            boleta.setDniEncargado(req.getDniEncargado());
        }

        if (req.getDetalles() != null) {
            for (DetalleRequest dr : req.getDetalles()) {
                Optional<Concepto> opt = conceptoRepository.findById(dr.getConceptoId());
                Concepto concepto = opt.orElseThrow(() -> new ResourceNotFoundException("Concepto no encontrado: " + dr.getConceptoId()));
                int cantidad = dr.getCantidad() != null ? dr.getCantidad() : 1;
                DetalleBoleta detalle = new DetalleBoleta();
                detalle.setConcepto(concepto);
                detalle.setCantidad(cantidad);
                detalle.setPrecioUnitario(concepto.getPrecio() != null ? concepto.getPrecio() : BigDecimal.ZERO);
                boleta.addDetalle(detalle);
            }
        }
        return boletaRepository.save(boleta);
    }

    @Transactional
    public void deleteBoleta(Long id) {
        Boleta b = boletaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta no encontrada: " + id));
        boletaRepository.delete(b);
    }

    @Transactional
    public Boleta markAsPaid(Long id) {
        Boleta b = boletaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta no encontrada: " + id));
        if (b.getEstado() == EstadoBoleta.PAGADA) {
            throw new InvalidOperationException("La boleta ya está marcada como pagada");
        }
        b.setEstado(EstadoBoleta.PAGADA);
        // si quieres, añade fechaPago en la entidad; por ahora solo cambiamos estado
        return boletaRepository.save(b);
    }

    public List<Boleta> listByClienteDni(String dniCliente) {
        return boletaRepository.findByDocumentoIdentidad(dniCliente);
    }

    public List<Boleta> listByEncargadoDni(String dniEncargado) {
        // asume que BoletaRepository tiene findByDniEncargado
        return boletaRepository.findByDniEncargadoOrderByFechaEmisionDesc(dniEncargado);
    }

    public List<Boleta> listUnpaid() {
        return boletaRepository.findByEstado(EstadoBoleta.PENDIENTE);
    }

    public List<Boleta> listPaid() {
        return boletaRepository.findByEstado(EstadoBoleta.PAGADA);
    }

    public List<Boleta> listAll() {
        return boletaRepository.findAll();
    }
}
