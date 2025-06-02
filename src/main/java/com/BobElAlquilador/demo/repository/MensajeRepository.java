package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Mensaje;
import com.BobElAlquilador.demo.model.Conversacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    // buscar mensajes de una conversacion ordenados por fecha de envío
    List<Mensaje> findByConversacionOrderByFechaEnvioAsc(Conversacion conversacion);

    
}
