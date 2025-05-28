package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Conversacion;
import com.BobElAlquilador.demo.model.Persona;

import org.antlr.v4.runtime.atn.SemanticContext.AND;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

  //List<Conversacion> findByCliente(Persona cliente);
  //List<Conversacion> findByEmpleado(Persona empleado);
  

}
