package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PreguntaRepository extends JpaRepository<Pregunta,Long> {
    //Describir más metodos de ser necesario
    public List<Pregunta> findByCliente (Persona cliente);
}
