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

    // Obtiene boleta por ID
    public Boleta getById(Long id) {
        return boletaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta no encontrada: " + id));
    }

    // Crea una nueva boleta con detalles
    @Transactional
    public Boleta createBoleta(BoletaRequest req, String dniEncargado) {
        // Valida request
        if (req == null) throw new InvalidOperationException("Request boleta vacío");
        Boleta boleta = new Boleta();
        boleta.setNombre(req.getNombre());
        boleta.setDireccion(req.getDireccion());
        boleta.setFechaEmision(req.getFechaEmision() != null ? req.getFechaEmision() : LocalDate.now());
        boleta.setDocumentoIdentidad(req.getDocumentoIdentidad());
        // Asigna DNI del encargado
        if (dniEncargado != null && !dniEncargado.isBlank()) {
            boleta.setDniEncargado(dniEncargado);
        } else if (req.getDniEncargado() != null && !req.getDniEncargado().isBlank()) {
            boleta.setDniEncargado(req.getDniEncargado());
        }

        // Agrega detalles si existen
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

    // Elimina boleta por ID
    @Transactional
    public void deleteBoleta(Long id) {
        Boleta b = boletaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta no encontrada: " + id));
        boletaRepository.delete(b);
    }

    // Marca boleta como pagada
    @Transactional
    public Boleta markAsPaid(Long id) {
        Boleta b = boletaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta no encontrada: " + id));
        if (b.getEstado() == EstadoBoleta.PAGADA) {
            throw new InvalidOperationException("La boleta ya está marcada como pagada");
        }
        b.setEstado(EstadoBoleta.PAGADA);
        return boletaRepository.save(b);
    }

    // Lista boletas por DNI del cliente
    public List<Boleta> listByClienteDni(String dniCliente) {
        return boletaRepository.findByDocumentoIdentidad(dniCliente);
    }

    // Lista boletas por DNI del encargado
    public List<Boleta> listByEncargadoDni(String dniEncargado) {
        return boletaRepository.findByDniEncargadoOrderByFechaEmisionDesc(dniEncargado);
    }

    // Lista boletas pendientes
    public List<Boleta> listUnpaid() {
        return boletaRepository.findByEstado(EstadoBoleta.PENDIENTE);
    }

    // Lista boletas pagadas
    public List<Boleta> listPaid() {
        return boletaRepository.findByEstado(EstadoBoleta.PAGADA);
    }

    // Lista todas las boletas
    public List<Boleta> listAll() {
        return boletaRepository.findAll();
    }
}