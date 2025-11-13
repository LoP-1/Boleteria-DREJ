package com.registro.pagos.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "conceptos")
public class Concepto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String unidadCompetente;

    @Column(nullable = false)
    private String pagina;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    public Concepto() {}

    public Concepto(Long id, String nombre, String unidadCompetente, String pagina, BigDecimal precio) {
        this.id = id;
        this.nombre = nombre;
        this.unidadCompetente = unidadCompetente;
        this.pagina = pagina;
        this.precio = precio;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUnidadCompetente() {
        return unidadCompetente;
    }

    public void setUnidadCompetente(String unidadCompetente) {
        this.unidadCompetente = unidadCompetente;
    }

    public String getPagina() {
        return pagina;
    }

    public void setPagina(String pagina) {
        this.pagina = pagina;
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

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
}