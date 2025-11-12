package com.registro.pagos.models;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalles_boleta")
public class DetalleBoleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // referencia a la boleta
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "boleta_id", nullable = false)
    private Boleta boleta;

    // referencia al concepto
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "concepto_id", nullable = false)
    private Concepto concepto;

    // cantidad del concepto en esta boleta (por defecto 1)
    @Column(nullable = false)
    private Integer cantidad = 1;

    // precio por unidad al momento de la emisión (permite historizar)
    @Column(name = "precio_unitario", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioUnitario;

    public DetalleBoleta() {}

    public DetalleBoleta(Concepto concepto, Integer cantidad, BigDecimal precioUnitario) {
        this.concepto = concepto;
        this.cantidad = cantidad != null ? cantidad : 1;
        this.precioUnitario = precioUnitario;
    }

    public Long getId() {
        return id;
    }

    public Boleta getBoleta() {
        return boleta;
    }

    public void setBoleta(Boleta boleta) {
        this.boleta = boleta;
    }

    public Concepto getConcepto() {
        return concepto;
    }

    public void setConcepto(Concepto concepto) {
        this.concepto = concepto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return precioUnitario.multiply(BigDecimal.valueOf(cantidad));
    }
}