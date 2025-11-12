package com.registro.pagos.repository;

import com.registro.pagos.models.Concepto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConceptoRepository extends JpaRepository<Concepto, Long> {
    Optional<Concepto> findByNombre(String nombre);
}