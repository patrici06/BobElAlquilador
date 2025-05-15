package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.ResenaMaquina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResenaMaquinaRepository extends JpaRepository<ResenaMaquina, Long> {
    // definir más metodos de requerirse.
}
