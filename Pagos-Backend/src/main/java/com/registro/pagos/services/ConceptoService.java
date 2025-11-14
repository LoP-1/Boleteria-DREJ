package com.registro.pagos.services;

import com.registro.pagos.models.Concepto;
import com.registro.pagos.repository.ConceptoRepository;
import com.registro.pagos.exception.ResourceNotFoundException;
import com.registro.pagos.exception.InvalidOperationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConceptoService {

    private final ConceptoRepository conceptoRepository;

    public ConceptoService(ConceptoRepository conceptoRepository) {
        this.conceptoRepository = conceptoRepository;
    }

    @Transactional
    public Concepto createConcepto(Concepto c) {
        if (c.getNombre() == null || c.getNombre().isBlank()) {
            throw new InvalidOperationException("Nombre de concepto requerido");
        }
        return conceptoRepository.save(c);
    }

    @Transactional
    public Concepto updateConcepto(Long id, Concepto cambios) {
        Concepto c = conceptoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Concepto no encontrado: " + id));
        if (cambios.getNombre() != null) c.setNombre(cambios.getNombre());
        if (cambios.getPrecio() != null) c.setPrecio(cambios.getPrecio());
        if (cambios.getPagina() != null) c.setPagina(cambios.getPagina());
        if (cambios.getUnidadCompetente() != null) c.setUnidadCompetente(cambios.getUnidadCompetente());
        return conceptoRepository.save(c);
    }

    @Transactional
    public void deleteConcepto(Long id) {
        Concepto c = conceptoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Concepto no encontrado: " + id));
        conceptoRepository.delete(c);
    }

    public Concepto findById(Long id) {
        return conceptoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Concepto no encontrado: " + id));
    }

    public List<Concepto> findAll() {
        return conceptoRepository.findAll();
    }
}