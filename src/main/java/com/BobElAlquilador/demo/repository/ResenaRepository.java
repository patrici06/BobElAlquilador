package com.BobElAlquilador.demo.repository;


import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    // agregar más metodos de ser necesarios
    public Resena findByEmpleado (Persona empleado);

    List<Resena> findByValoracion(int valoracion);
}
