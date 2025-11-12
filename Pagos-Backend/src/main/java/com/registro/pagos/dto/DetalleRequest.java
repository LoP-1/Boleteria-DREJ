package com.registro.pagos.dto;

public class DetalleRequest {
    private Long conceptoId;
    private Integer cantidad = 1;

    public DetalleRequest() {}

    public Long getConceptoId() {
        return conceptoId;
    }

    public void setConceptoId(Long conceptoId) {
        this.conceptoId = conceptoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}