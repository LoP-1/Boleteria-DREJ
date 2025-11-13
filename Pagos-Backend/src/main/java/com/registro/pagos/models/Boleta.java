package com.registro.pagos.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boletas")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nombre;

    private String direccion;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDate fechaEmision;

    @Column(name = "doc_identidad", nullable = false)
    private String documentoIdentidad;

    @Column(name = "dni_encargado", nullable = true)
    private String dniEncargado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoBoleta estado = EstadoBoleta.PENDIENTE;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DetalleBoleta> detalles = new ArrayList<>();

    public Boleta() {}

    public Boleta(String nombre, String direccion, LocalDate fechaEmision, String documentoIdentidad) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.fechaEmision = fechaEmision;
        this.documentoIdentidad = documentoIdentidad;
        this.estado = EstadoBoleta.PENDIENTE;
    }

    // Constructor adicional que incluye el dni del encargado
    public Boleta(String nombre, String direccion, LocalDate fechaEmision, String documentoIdentidad, String dniEncargado) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.fechaEmision = fechaEmision;
        this.documentoIdentidad = documentoIdentidad;
        this.dniEncargado = dniEncargado;
        this.estado = EstadoBoleta.PENDIENTE;
    }

    public Long getId() {
        return id;
    }

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

    public String getDniEncargado() {
        return dniEncargado;
    }

    public void setDniEncargado(String dniEncargado) {
        this.dniEncargado = dniEncargado;
    }

    public EstadoBoleta getEstado() {
        return estado;
    }

    public void setEstado(EstadoBoleta estado) {
        this.estado = estado;
    }

    public List<DetalleBoleta> getDetalles() {
        return detalles;
    }

    public void addDetalle(DetalleBoleta detalle) {
        detalle.setBoleta(this);
        this.detalles.add(detalle);
    }

    public void removeDetalle(DetalleBoleta detalle) {
        detalle.setBoleta(null);
        this.detalles.remove(detalle);
    }
}