package com.BobElAlquilador.demo.repository;


import com.BobElAlquilador.demo.model.Conversacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversacionRepository extends JpaRepository<Conversacion,Integer> {
    //definir más metodos de ser necesarios
}
