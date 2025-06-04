package com.BobElAlquilador.demo.service;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.IteracionId;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Respuesta;
import com.BobElAlquilador.demo.repository.RespuestaRepository;
import com.BobElAlquilador.demo.repository.IteracionRepository;

@Service
public class RespuestaService {

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private IteracionRepository iteracionRepository;

    public Respuesta responderIteracion(Long conversacionId, Long preguntaId, String cuerpoRespuesta, Persona empleado) {
        // Buscar la iteración usando la clave compuesta
        IteracionId iteracionId = new IteracionId(conversacionId, preguntaId);
        Iteracion iteracion = iteracionRepository.findById(iteracionId)
                .orElseThrow(() -> new IllegalArgumentException("Iteración no encontrada"));

        // Verificar que la iteración no tenga ya una respuesta
        if (iteracion.getRespuesta() != null) {
            throw new IllegalStateException("Esta pregunta ya fue respondida");
        }

        // Validar el cuerpo de la respuesta
        if (cuerpoRespuesta == null || cuerpoRespuesta.isBlank()) {
            throw new IllegalArgumentException("La respuesta no puede estar vacía");
        }

        // Crear y guardar la nueva respuesta
        Respuesta respuesta = new Respuesta(
            empleado,
            LocalDate.now(),
            LocalTime.now(),
            cuerpoRespuesta
        );
        
        Respuesta respuestaGuardada = respuestaRepository.save(respuesta);

        // Actualizar la iteración con la respuesta
        iteracion.setRespuesta(respuestaGuardada);
        iteracionRepository.save(iteracion);

        return respuestaGuardada;
    }
}

