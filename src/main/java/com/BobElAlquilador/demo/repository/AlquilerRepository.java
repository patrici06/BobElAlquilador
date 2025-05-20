package com.BobElAlquilador.demo.repository;


import com.BobElAlquilador.demo.model.Alquiler;
import com.BobElAlquilador.demo.model.AlquilerId;
import com.BobElAlquilador.demo.model.EstadoAlquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, AlquilerId> {

    // Metodo para devolver los alquileres activos / pendientes realizados por un cliente
    // HU: Listar mis alquileres
    List<Alquiler> findByClienteDniAndEstado(String dni, EstadoAlquiler estado);

    // Encuentra alquileres que solapen un rango dado para la misma máquina
    // Metodo necesario para la HU Alquilar Maquina
    @Query("""
      SELECT a FROM Alquiler a
      WHERE a.maquina.nombre_maquina = :maquinaName
        AND a.estado = com.BobElAlquilador.demo.model.EstadoAlquiler.Pendiente
        AND a.alquilerId.fechaInicio < :fin
        AND a.alquilerId.fechaFin > :inicio
    """)
    List<Alquiler> findOverlapping(
            @Param("maquinaName") String maquinaName,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin);

}