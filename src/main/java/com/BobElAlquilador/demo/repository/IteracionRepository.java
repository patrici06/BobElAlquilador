package com.BobElAlquilador.demo.repository;


import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.IteracionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IteracionRepository extends JpaRepository<Iteracion, IteracionId> {
    //Describir más metodos de ser necesario
}
