package com.registro.pagos.dto;

import java.time.LocalDate;
import java.util.List;

public class BoletaRequest {
    private String nombre;
    private String direccion;
    private LocalDate fechaEmision;
    private String documentoIdentidad;
    private List<DetalleRequest> detalles;
    // opcional: permitir enviar dniEncargado; si usas token/header puedes ignorar este campo
    private String dniEncargado;

    public BoletaRequest() {}

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }

    public List<DetalleRequest> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleRequest> detalles) {
        this.detalles = detalles;
    }

    public String getDniEncargado() {
        return dniEncargado;
    }

    public void setDniEncargado(String dniEncargado) {
        this.dniEncargado = dniEncargado;
    }
}