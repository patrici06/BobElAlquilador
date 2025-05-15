package com.BobElAlquilador.demo.repository;


import com.BobElAlquilador.demo.model.Alquiler;
import com.BobElAlquilador.demo.model.AlquilerId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, AlquilerId> {
    //Agregar implementaciones más adelante
}