package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.IteracionId;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IteracionRepository extends JpaRepository<Iteracion, IteracionId> {
    // Busca todas las iteraciones de un cliente por email
    List<Iteracion> findAllByPregunta_Cliente_Email(String email);

    // Busca todas las iteraciones sin respuesta
    List<Iteracion> findAllByRespuestaIsNull();

    // Busca una iteracion por id de conversacion
    Optional<Iteracion> findByConversacion_IdConversacion(Long idConversacion);
}