package com.registro.pagos.controllers;

import com.registro.pagos.dto.DashboardSummaryDTO;
import com.registro.pagos.dto.TimeSeriesPointDTO;
import com.registro.pagos.dto.TopConceptDTO;
import com.registro.pagos.services.DashboardService;
import com.registro.pagos.services.ExportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ExportService exportService;

    public DashboardController(DashboardService dashboardService, ExportService exportService) {
        this.dashboardService = dashboardService;
        this.exportService = exportService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String unidadCompetente) {
        // Obtiene el resumen del dashboard con filtros opcionales
        DashboardSummaryDTO dto = dashboardService.getSummary(dateFrom, dateTo, unidadCompetente);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<TimeSeriesPointDTO>> getRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        // Obtiene la serie de ingresos por periodo
        List<TimeSeriesPointDTO> series = dashboardService.getRevenueTimeSeries(dateFrom, dateTo);
        return ResponseEntity.ok(series);
    }

    @GetMapping("/top-concepts")
    public ResponseEntity<List<TopConceptDTO>> getTopConcepts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "amount") String sortBy) {
        // Obtiene los top conceptos por monto
        List<TopConceptDTO> list = dashboardService.getTopConcepts(dateFrom, dateTo, limit, sortBy);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/export/ventas-por-dia")
    public void exportVentasPorDia(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "excel") String format,
            HttpServletResponse response) throws IOException {
        // Exporta ventas por día en CSV o Excel
        String filename;
        if ("csv".equalsIgnoreCase(format)) {
            filename = String.format("ventas_por_dia_%s_%s.csv",
                    dateFrom.format(DateTimeFormatter.ISO_DATE),
                    dateTo.format(DateTimeFormatter.ISO_DATE));
            response.setContentType("text/csv; charset=UTF-8");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            exportService.exportVentasPorDiaCSV(dateFrom, dateTo, response.getOutputStream());
        } else {
            filename = String.format("ventas_por_dia_%s_%s.xlsx",
                    dateFrom.format(DateTimeFormatter.ISO_DATE),
                    dateTo.format(DateTimeFormatter.ISO_DATE));
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            exportService.exportVentasPorDiaExcel(dateFrom, dateTo, response.getOutputStream());
        }
    }

    @GetMapping("/export/boletas-detalladas")
    public void exportBoletasDetalladas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "excel") String format,
            HttpServletResponse response) throws IOException {
        // Exporta boletas detalladas en CSV o Excel
        String filename;
        if ("csv".equalsIgnoreCase(format)) {
            filename = String.format("boletas_detalladas_%s_%s.csv",
                    dateFrom.format(DateTimeFormatter.ISO_DATE),
                    dateTo.format(DateTimeFormatter.ISO_DATE));
            response.setContentType("text/csv; charset=UTF-8");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            exportService.exportBoletasDetalladasCSV(dateFrom, dateTo, response.getOutputStream());
        } else {
            filename = String.format("boletas_detalladas_%s_%s.xlsx",
                    dateFrom.format(DateTimeFormatter.ISO_DATE),
                    dateTo.format(DateTimeFormatter.ISO_DATE));
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            exportService.exportBoletasDetalladasExcel(dateFrom, dateTo, response.getOutputStream());
        }
    }
}