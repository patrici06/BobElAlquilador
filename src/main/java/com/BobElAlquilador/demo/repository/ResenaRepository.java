package com.BobElAlquilador.demo.repository;


import com.BobElAlquilador.demo.model.Empleado;
import com.BobElAlquilador.demo.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    // agregar más metodos de ser necesarios
    public Resena findByEmpleado (Empleado empleado);
}
