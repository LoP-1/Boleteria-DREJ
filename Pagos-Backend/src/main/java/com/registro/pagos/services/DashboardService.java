package com.registro.pagos.services;

import com.registro.pagos.dto.DashboardSummaryDTO;
import com.registro.pagos.dto.TimeSeriesPointDTO;
import com.registro.pagos.dto.TopConceptDTO;
import com.registro.pagos.models.EstadoBoleta;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final EntityManager em;

    public DashboardService(EntityManager em) {
        this.em = em;
    }

    // Define fecha desde por defecto (primer día del mes actual)
    private LocalDate defaultFrom(LocalDate from) {
        if (from != null) return from;
        return LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
    }

    // Define fecha hasta por defecto (hoy)
    private LocalDate defaultTo(LocalDate to) {
        if (to != null) return to;
        return LocalDate.now();
    }

    // Obtiene resumen del dashboard con filtros opcionales
    @Transactional(readOnly = true)
    public DashboardSummaryDTO getSummary(LocalDate dateFrom, LocalDate dateTo, String unidadCompetente) {
        LocalDate from = defaultFrom(dateFrom);
        LocalDate to = defaultTo(dateTo);

        // Consulta JPQL para total facturado (solo boletas pagadas)
        StringBuilder totalFacturadoJpql = new StringBuilder();
        totalFacturadoJpql.append("SELECT COALESCE(SUM(d.precioUnitario * d.cantidad), 0) ")
                .append("FROM DetalleBoleta d JOIN d.boleta b ")
                .append("WHERE b.fechaEmision BETWEEN :from AND :to AND b.estado = :estado ");
        if (unidadCompetente != null) {
            totalFacturadoJpql.append("AND d.concepto.unidadCompetente = :unidad ");
        }

        TypedQuery<BigDecimal> q1 = em.createQuery(totalFacturadoJpql.toString(), BigDecimal.class);
        q1.setParameter("from", from);
        q1.setParameter("to", to);
        q1.setParameter("estado", EstadoBoleta.PAGADA);
        if (unidadCompetente != null) q1.setParameter("unidad", unidadCompetente);
        BigDecimal totalFacturado = q1.getSingleResult();

        // Consulta para total de boletas
        StringBuilder totalBoletasJpql = new StringBuilder();
        totalBoletasJpql.append("SELECT COUNT(b) FROM Boleta b ")
                .append("WHERE b.fechaEmision BETWEEN :from AND :to ");
        if (unidadCompetente != null) {
            totalBoletasJpql.append("AND EXISTS (SELECT 1 FROM DetalleBoleta d2 WHERE d2.boleta = b AND d2.concepto.unidadCompetente = :unidad) ");
        }

        TypedQuery<Long> q2 = em.createQuery(totalBoletasJpql.toString(), Long.class);
        q2.setParameter("from", from);
        q2.setParameter("to", to);
        if (unidadCompetente != null) q2.setParameter("unidad", unidadCompetente);
        Long totalBoletas = q2.getSingleResult();

        // Consulta para total de pendientes
        String pendientesJpql =
                "SELECT COUNT(b) FROM Boleta b WHERE b.fechaEmision BETWEEN :from AND :to AND b.estado = :estadoPendiente";
        TypedQuery<Long> q3 = em.createQuery(pendientesJpql, Long.class);
        q3.setParameter("from", from);
        q3.setParameter("to", to);
        q3.setParameter("estadoPendiente", EstadoBoleta.PENDIENTE);
        Long totalPendientes = q3.getSingleResult();

        // Consulta para total de items
        StringBuilder totalItemsJpql = new StringBuilder();
        totalItemsJpql.append("SELECT COALESCE(SUM(d.cantidad), 0) FROM DetalleBoleta d JOIN d.boleta b ")
                .append("WHERE b.fechaEmision BETWEEN :from AND :to ");
        if (unidadCompetente != null) {
            totalItemsJpql.append("AND d.concepto.unidadCompetente = :unidad ");
        }

        TypedQuery<Long> q4 = em.createQuery(totalItemsJpql.toString(), Long.class);
        q4.setParameter("from", from);
        q4.setParameter("to", to);
        if (unidadCompetente != null) q4.setParameter("unidad", unidadCompetente);
        Long totalItems = q4.getSingleResult();

        return new DashboardSummaryDTO(totalBoletas, totalFacturado, totalPendientes, totalItems);
    }

    // Obtiene serie de tiempo para ingresos
    @Transactional(readOnly = true)
    public List<TimeSeriesPointDTO> getRevenueTimeSeries(LocalDate dateFrom, LocalDate dateTo) {
        LocalDate from = defaultFrom(dateFrom);
        LocalDate to = defaultTo(dateTo);

        String jpql =
                "SELECT b.fechaEmision, COALESCE(SUM(d.precioUnitario * d.cantidad), 0) " +
                        "FROM DetalleBoleta d JOIN d.boleta b " +
                        "WHERE b.fechaEmision BETWEEN :from AND :to AND b.estado = :estado " +
                        "GROUP BY b.fechaEmision ORDER BY b.fechaEmision";

        TypedQuery<Object[]> q = em.createQuery(jpql, Object[].class);
        q.setParameter("from", from);
        q.setParameter("to", to);
        q.setParameter("estado", EstadoBoleta.PAGADA);

        List<Object[]> results = q.getResultList();
        List<TimeSeriesPointDTO> series = new ArrayList<>(results.size());
        for (Object[] r : results) {
            LocalDate fecha = (LocalDate) r[0];
            BigDecimal total = (BigDecimal) r[1];
            series.add(new TimeSeriesPointDTO(fecha, total));
        }
        return series;
    }

    // Obtiene top conceptos por monto o cantidad
    @Transactional(readOnly = true)
    public List<TopConceptDTO> getTopConcepts(LocalDate dateFrom, LocalDate dateTo, int limit, String sortBy) {
        LocalDate from = defaultFrom(dateFrom);
        LocalDate to = defaultTo(dateTo);

        String base =
                "SELECT d.concepto.id, d.concepto.nombre, COALESCE(SUM(d.cantidad),0), COALESCE(SUM(d.precioUnitario * d.cantidad),0) " +
                        "FROM DetalleBoleta d JOIN d.boleta b " +
                        "WHERE b.fechaEmision BETWEEN :from AND :to " +
                        "GROUP BY d.concepto.id, d.concepto.nombre ";

        String order;
        if ("quantity".equalsIgnoreCase(sortBy)) {
            order = "ORDER BY COALESCE(SUM(d.cantidad),0) DESC";
        } else {
            order = "ORDER BY COALESCE(SUM(d.precioUnitario * d.cantidad),0) DESC";
        }

        TypedQuery<Object[]> q = em.createQuery(base + order, Object[].class);
        q.setParameter("from", from);
        q.setParameter("to", to);
        q.setMaxResults(limit);

        List<Object[]> rows = q.getResultList();
        List<TopConceptDTO> out = new ArrayList<>(rows.size());
        for (Object[] r : rows) {
            Long conceptoId = ((Number) r[0]).longValue();
            String nombre = (String) r[1];
            Long cantidad = ((Number) r[2]).longValue();
            BigDecimal monto = (BigDecimal) r[3];
            out.add(new TopConceptDTO(conceptoId, nombre, cantidad, monto));
        }
        return out;
    }
}