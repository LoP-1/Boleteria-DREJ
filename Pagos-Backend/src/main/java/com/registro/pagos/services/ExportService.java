package com.registro.pagos.services;

import com.registro.pagos.models.EstadoBoleta;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    private final EntityManager em;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public ExportService(EntityManager em) {
        this.em = em;
    }

    @Transactional(readOnly = true)
    public void exportVentasPorDiaCSV(LocalDate dateFrom, LocalDate dateTo, OutputStream out) throws IOException {
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, StandardCharsets.UTF_8));
        writer.write("Fecha,Boletas Emitidas,Boletas Pagadas,Total Facturado,Total Items\n");

        String jpql = "SELECT b.fechaEmision, COUNT(b), " +
                "SUM(CASE WHEN b.estado = :estadoPagada THEN 1 ELSE 0 END), " +
                "COALESCE(SUM(CASE WHEN b.estado = :estadoPagada THEN " +
                "(SELECT SUM(d.precioUnitario * d.cantidad) FROM DetalleBoleta d WHERE d.boleta = b) ELSE 0 END), 0), " +
                "COALESCE(SUM((SELECT SUM(d.cantidad) FROM DetalleBoleta d WHERE d.boleta = b)), 0) " +
                "FROM Boleta b " +
                "WHERE b.fechaEmision BETWEEN :from AND :to " +
                "GROUP BY b.fechaEmision " +
                "ORDER BY b.fechaEmision";

        Query q = em.createQuery(jpql);
        q.setParameter("from", dateFrom);
        q.setParameter("to", dateTo);
        q.setParameter("estadoPagada", EstadoBoleta.PAGADA);

        List<Object[]> results = q.getResultList();

        for (Object[] row : results) {
            LocalDate fecha = (LocalDate) row[0];
            Long totalBoletas = ((Number) row[1]).longValue();
            Long boletasPagadas = ((Number) row[2]).longValue();
            BigDecimal totalFacturado = (BigDecimal) row[3];
            Long totalItems = ((Number) row[4]).longValue();

            writer.write(String.format("%s,%d,%d,%.2f,%d\n",
                    fecha.format(DATE_FORMATTER),
                    totalBoletas,
                    boletasPagadas,
                    totalFacturado.doubleValue(),
                    totalItems));
        }

        writer.flush();
    }

    @Transactional(readOnly = true)
    public void exportVentasPorDiaExcel(LocalDate dateFrom, LocalDate dateTo, OutputStream out) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Ventas por Dia");

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        CellStyle dateStyle = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-mm-dd"));

        CellStyle moneyStyle = workbook.createCellStyle();
        moneyStyle.setDataFormat(createHelper.createDataFormat().getFormat("S/. #,##0.00"));

        Row headerRow = sheet.createRow(0);
        String[] columns = {"Fecha", "Boletas Emitidas", "Boletas Pagadas", "Total Facturado", "Total Items"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        String jpql = "SELECT b.fechaEmision, COUNT(b), " +
                "SUM(CASE WHEN b.estado = :estadoPagada THEN 1 ELSE 0 END), " +
                "COALESCE(SUM(CASE WHEN b.estado = :estadoPagada THEN " +
                "(SELECT SUM(d.precioUnitario * d.cantidad) FROM DetalleBoleta d WHERE d.boleta = b) ELSE 0 END), 0), " +
                "COALESCE(SUM((SELECT SUM(d.cantidad) FROM DetalleBoleta d WHERE d.boleta = b)), 0) " +
                "FROM Boleta b " +
                "WHERE b.fechaEmision BETWEEN :from AND :to " +
                "GROUP BY b.fechaEmision " +
                "ORDER BY b.fechaEmision";

        Query q = em.createQuery(jpql);
        q.setParameter("from", dateFrom);
        q.setParameter("to", dateTo);
        q.setParameter("estadoPagada", EstadoBoleta.PAGADA);

        List<Object[]> results = q.getResultList();

        int rowNum = 1;
        for (Object[] rowData : results) {
            Row row = sheet.createRow(rowNum++);

            LocalDate fecha = (LocalDate) rowData[0];
            Cell cell0 = row.createCell(0);
            cell0.setCellValue(fecha.toString());

            row.createCell(1).setCellValue(((Number) rowData[1]).longValue());
            row.createCell(2).setCellValue(((Number) rowData[2]).longValue());

            Cell cell3 = row.createCell(3);
            cell3.setCellValue(((BigDecimal) rowData[3]).doubleValue());
            cell3.setCellStyle(moneyStyle);

            row.createCell(4).setCellValue(((Number) rowData[4]).longValue());
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        workbook.write(out);
        workbook.close();
    }

    @Transactional(readOnly = true)
    public void exportBoletasDetalladasCSV(LocalDate dateFrom, LocalDate dateTo, OutputStream out) throws IOException {
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, StandardCharsets.UTF_8));
        writer.write("Fecha,Boleta ID,Nombre,DNI,Estado,Concepto,Cantidad,Precio Unit,Subtotal\n");

        String jpql = "SELECT b.fechaEmision, b.id, b.nombre, b.documentoIdentidad, b.estado, " +
                "d.concepto.nombre, d.cantidad, d.precioUnitario, (d.cantidad * d.precioUnitario) " +
                "FROM DetalleBoleta d JOIN d.boleta b " +
                "WHERE b.fechaEmision BETWEEN :from AND :to " +
                "ORDER BY b.fechaEmision, b.id";

        Query q = em.createQuery(jpql);
        q.setParameter("from", dateFrom);
        q.setParameter("to", dateTo);

        List<Object[]> results = q.getResultList();

        for (Object[] row : results) {
            LocalDate fecha = (LocalDate) row[0];
            Long boletaId = ((Number) row[1]).longValue();
            String nombre = (String) row[2];
            String dni = (String) row[3];
            EstadoBoleta estado = (EstadoBoleta) row[4];
            String concepto = (String) row[5];
            Integer cantidad = (Integer) row[6];
            BigDecimal precioUnit = (BigDecimal) row[7];
            BigDecimal subtotal = (BigDecimal) row[8];

            writer.write(String.format("%s,%d,%s,%s,%s,%s,%d,%.2f,%.2f\n",
                    fecha.format(DATE_FORMATTER),
                    boletaId,
                    escapeCsv(nombre),
                    dni,
                    estado.name(),
                    escapeCsv(concepto),
                    cantidad,
                    precioUnit.doubleValue(),
                    subtotal.doubleValue()));
        }

        writer.flush();
    }

    @Transactional(readOnly = true)
    public void exportBoletasDetalladasExcel(LocalDate dateFrom, LocalDate dateTo, OutputStream out) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Boletas Detalladas");

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        CellStyle moneyStyle = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        moneyStyle.setDataFormat(createHelper.createDataFormat().getFormat("S/. #,##0.00"));

        Row headerRow = sheet.createRow(0);
        String[] columns = {"Fecha", "Boleta ID", "Nombre", "DNI", "Estado", "Concepto", "Cantidad", "Precio Unit", "Subtotal"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        String jpql = "SELECT b.fechaEmision, b.id, b.nombre, b.documentoIdentidad, b.estado, " +
                "d.concepto.nombre, d.cantidad, d.precioUnitario, (d.cantidad * d.precioUnitario) " +
                "FROM DetalleBoleta d JOIN d.boleta b " +
                "WHERE b.fechaEmision BETWEEN :from AND :to " +
                "ORDER BY b.fechaEmision, b.id";

        Query q = em.createQuery(jpql);
        q.setParameter("from", dateFrom);
        q.setParameter("to", dateTo);

        List<Object[]> results = q.getResultList();

        int rowNum = 1;
        for (Object[] rowData : results) {
            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(((LocalDate) rowData[0]).toString());
            row.createCell(1).setCellValue(((Number) rowData[1]).longValue());
            row.createCell(2).setCellValue((String) rowData[2]);
            row.createCell(3).setCellValue((String) rowData[3]);
            row.createCell(4).setCellValue(((EstadoBoleta) rowData[4]).name());
            row.createCell(5).setCellValue((String) rowData[5]);
            row.createCell(6).setCellValue((Integer) rowData[6]);

            Cell cell7 = row.createCell(7);
            cell7.setCellValue(((BigDecimal) rowData[7]).doubleValue());
            cell7.setCellStyle(moneyStyle);

            Cell cell8 = row.createCell(8);
            cell8.setCellValue(((BigDecimal) rowData[8]).doubleValue());
            cell8.setCellStyle(moneyStyle);
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        workbook.write(out);
        workbook.close();
    }

    private String escapeCsv(String s) {
        if (s == null) return "";
        if (s.contains(",") || s.contains("\"") || s.contains("\n")) {
            return "\"" + s.replace("\"", "\"\"") + "\"";
        }
        return s;
    }
}