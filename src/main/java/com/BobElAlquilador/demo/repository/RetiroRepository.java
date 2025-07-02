package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Retiro;
import com.BobElAlquilador.demo.model.AlquilerId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RetiroRepository extends JpaRepository<Retiro, Long> {
    boolean existsByAlquiler_AlquilerId(AlquilerId alquilerId);
}