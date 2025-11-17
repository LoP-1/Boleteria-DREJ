package com.registro.pagos.repository;

import java.time.LocalDate;
import java.util.List;

import com.registro.pagos.models.Boleta;
import com.registro.pagos.models.EstadoBoleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    // Busca boletas por documento de identidad del cliente
    List<Boleta> findByDocumentoIdentidad(String documentoIdentidad);
    // Busca boletas por estado
    List<Boleta> findByEstado(EstadoBoleta estado);
    // Busca boletas por rango de fechas de emisión
    List<Boleta> findByFechaEmisionBetween(LocalDate start, LocalDate end);
    // Busca boletas por DNI del encargado, ordenadas por fecha de emisión descendente
    List<Boleta> findByDniEncargadoOrderByFechaEmisionDesc(String dniEncargado);
}