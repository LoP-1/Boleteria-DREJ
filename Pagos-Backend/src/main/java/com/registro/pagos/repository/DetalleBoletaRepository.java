package com.registro.pagos.repository;

import java.util.List;

import com.registro.pagos.models.DetalleBoleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleBoletaRepository extends JpaRepository<DetalleBoleta, Long> {
    List<DetalleBoleta> findByBoletaId(Long boletaId);
    List<DetalleBoleta> findByConceptoId(Long conceptoId);
}