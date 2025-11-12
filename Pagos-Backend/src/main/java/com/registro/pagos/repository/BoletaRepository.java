package com.registro.pagos.repository;

import java.time.LocalDate;
import java.util.List;

import com.registro.pagos.models.Boleta;
import com.registro.pagos.models.EstadoBoleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    List<Boleta> findByDocumentoIdentidad(String documentoIdentidad);
    List<Boleta> findByEstado(EstadoBoleta estado);
    List<Boleta> findByFechaEmisionBetween(LocalDate start, LocalDate end);
    List<Boleta> findByDniEncargadoOrderByFechaEmisionDesc(String dniEncargado);
}