package com.registro.pagos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TimeSeriesPointDTO {
    private LocalDate period;
    private BigDecimal total;

    public TimeSeriesPointDTO() {}

    public TimeSeriesPointDTO(LocalDate period, BigDecimal total) {
        this.period = period;
        this.total = total;
    }

    public LocalDate getPeriod() { return period; }
    public void setPeriod(LocalDate period) { this.period = period; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
}