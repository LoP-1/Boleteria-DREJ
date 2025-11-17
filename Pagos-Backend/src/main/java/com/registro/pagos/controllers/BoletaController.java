package com.registro.pagos.controllers;

import com.registro.pagos.dto.BoletaRequest;
import com.registro.pagos.models.Boleta;
import com.registro.pagos.services.BoletaService;
import com.registro.pagos.exception.InvalidOperationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boletas")
public class BoletaController {

    private final BoletaService boletaService;

    public BoletaController(BoletaService boletaService) {
        this.boletaService = boletaService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Boleta> getById(@PathVariable Long id) {
        // Obtiene una boleta por ID
        Boleta b = boletaService.getById(id);
        return ResponseEntity.ok(b);
    }

    @PostMapping
    public ResponseEntity<Boleta> create(
            @RequestHeader(value = "X-DNI", required = false) String dniHeader,
            @RequestBody BoletaRequest request) {
        // Valida que se proporcione DNI del encargado
        if ((dniHeader == null || dniHeader.isBlank()) && (request.getDniEncargado() == null || request.getDniEncargado().isBlank())) {
            throw new InvalidOperationException("Se requiere X-DNI header o dniEncargado en el body para identificar al encargado");
        }
        // Crea la boleta
        Boleta created = boletaService.createBoleta(request, dniHeader);
        return ResponseEntity.status(201).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        // Elimina una boleta por ID
        boletaService.deleteBoleta(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/pagada")
    public ResponseEntity<Boleta> markPaid(@PathVariable Long id) {
        // Marca una boleta como pagada
        Boleta updated = boletaService.markAsPaid(id);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/cliente/{dniCliente}")
    public ResponseEntity<List<Boleta>> listByCliente(@PathVariable String dniCliente) {
        // Lista boletas por DNI del cliente
        return ResponseEntity.ok(boletaService.listByClienteDni(dniCliente));
    }

    @GetMapping("/encargado/{dniEncargado}")
    public ResponseEntity<List<Boleta>> listByEncargado(@PathVariable String dniEncargado) {
        // Lista boletas por DNI del encargado
        return ResponseEntity.ok(boletaService.listByEncargadoDni(dniEncargado));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<Boleta>> listPendientes() {
        // Lista boletas pendientes
        return ResponseEntity.ok(boletaService.listUnpaid());
    }

    @GetMapping("/pagadas")
    public ResponseEntity<List<Boleta>> listPagadas() {
        // Lista boletas pagadas
        return ResponseEntity.ok(boletaService.listPaid());
    }

    @GetMapping
    public ResponseEntity<List<Boleta>> listAll() {
        // Lista todas las boletas
        return ResponseEntity.ok(boletaService.listAll());
    }
}