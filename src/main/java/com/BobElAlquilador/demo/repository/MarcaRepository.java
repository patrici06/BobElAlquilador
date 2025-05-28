package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Integer> {
    //Describir más metodos de ser necesario
}
