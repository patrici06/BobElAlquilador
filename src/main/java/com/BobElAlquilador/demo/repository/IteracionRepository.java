package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.IteracionId;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IteracionRepository extends JpaRepository<Iteracion, IteracionId> {
    
    @Query("SELECT i FROM Iteracion i WHERE i.pregunta.cliente.email = :email")
    List<Iteracion> findByPreguntaClienteEmail(@Param("email") String email);
    
    @Query("SELECT i FROM Iteracion i WHERE i.respuesta IS NULL")
    List<Iteracion> findByRespuestaIsNull();
    
    @Query("SELECT i FROM Iteracion i WHERE i.conversacion.idConversacion = :idConversacion")
    Optional<Iteracion> findByConversacionId(@Param("idConversacion") Long idConversacion);
}
