package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, String> {
    //Describir más metodos de ser necesario
}
