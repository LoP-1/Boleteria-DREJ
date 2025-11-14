package com.registro.pagos.dto;
import java.math.BigDecimal;

public class DashboardSummaryDTO {
    private Long totalBoletas;
    private BigDecimal totalFacturado;
    private Long totalPendientes;
    private Long totalItems;

    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(Long totalBoletas, BigDecimal totalFacturado, Long totalPendientes, Long totalItems) {
        this.totalBoletas = totalBoletas;
        this.totalFacturado = totalFacturado;
        this.totalPendientes = totalPendientes;
        this.totalItems = totalItems;
    }

    public Long getTotalBoletas() { return totalBoletas; }
    public void setTotalBoletas(Long totalBoletas) { this.totalBoletas = totalBoletas; }

    public BigDecimal getTotalFacturado() { return totalFacturado; }
    public void setTotalFacturado(BigDecimal totalFacturado) { this.totalFacturado = totalFacturado; }

    public Long getTotalPendientes() { return totalPendientes; }
    public void setTotalPendientes(Long totalPendientes) { this.totalPendientes = totalPendientes; }

    public Long getTotalItems() { return totalItems; }
    public void setTotalItems(Long totalItems) { this.totalItems = totalItems; }
}