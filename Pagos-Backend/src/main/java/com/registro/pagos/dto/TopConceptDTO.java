package com.registro.pagos.dto;

import java.math.BigDecimal;

public class TopConceptDTO {
    private Long conceptoId;
    private String nombre;
    private Long cantidad;
    private BigDecimal monto;

    public TopConceptDTO() {}

    public TopConceptDTO(Long conceptoId, String nombre, Long cantidad, BigDecimal monto) {
        this.conceptoId = conceptoId;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.monto = monto;
    }

    public Long getConceptoId() { return conceptoId; }
    public void setConceptoId(Long conceptoId) { this.conceptoId = conceptoId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Long getCantidad() { return cantidad; }
    public void setCantidad(Long cantidad) { this.cantidad = cantidad; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
}
