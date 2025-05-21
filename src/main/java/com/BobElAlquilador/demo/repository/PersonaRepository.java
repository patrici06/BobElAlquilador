package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, String> {
    boolean existsPersonaByDni(String dni);
    boolean existsPersonaByEmail(String email);
    Optional<Persona> findByEmail(String email);
}
