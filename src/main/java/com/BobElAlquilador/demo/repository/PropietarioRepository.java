package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Propietario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropietarioRepository extends JpaRepository<Propietario, String> {
    //Definir más de ser necesario
}
