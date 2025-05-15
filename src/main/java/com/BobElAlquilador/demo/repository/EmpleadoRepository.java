package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado,String> {
    //Definir más metodos de ser necesario
}
