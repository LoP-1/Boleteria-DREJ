package com.registro.pagos.controllers;

import com.registro.pagos.models.Concepto;
import com.registro.pagos.services.ConceptoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conceptos")
public class ConceptoController {

    private final ConceptoService conceptoService;

    public ConceptoController(ConceptoService conceptoService) {
        this.conceptoService = conceptoService;
    }

    @PostMapping
    public ResponseEntity<Concepto> create(@RequestBody Concepto concepto) {
        Concepto created = conceptoService.createConcepto(concepto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Concepto> update(@PathVariable Long id, @RequestBody Concepto cambios) {
        Concepto updated = conceptoService.updateConcepto(id, cambios);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        conceptoService.deleteConcepto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Concepto>> listAll() {
        return ResponseEntity.ok(conceptoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Concepto> getById(@PathVariable Long id) {
        Concepto c = conceptoService.findById(id);
        return ResponseEntity.ok(c);
    }
}