package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Respuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {
    //
}
