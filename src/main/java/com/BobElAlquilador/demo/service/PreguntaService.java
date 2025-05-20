package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Pregunta;
import com.BobElAlquilador.demo.repository.PreguntaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class PreguntaService {

    @Autowired
    private PreguntaRepository preguntaRepository;

    public Pregunta crearConsulta(Pregunta pregunta) {
        if (pregunta.getCuerpo() == null || pregunta.getCuerpo().isBlank()) {
            throw new IllegalArgumentException("La consulta no puede estar vacía");
        }

        // Asignar fecha y hora actuales si no vienen en el body
        if (pregunta.getFecha() == null) {
            pregunta.setFecha(LocalDate.now());
        }
        if (pregunta.getHora() == null) {
            pregunta.setHora(LocalTime.now());
        }

        return preguntaRepository.save(pregunta);
    }

    public Pregunta crearRespuestaDelCliente(Pregunta nuevaRespuesta) {
        if (nuevaRespuesta.getCuerpo() == null || nuevaRespuesta.getCuerpo().isBlank()) {
            throw new IllegalArgumentException("La respuesta del cliente no puede estar vacía");
        }
        if (nuevaRespuesta.getPreguntaOriginal() == null) {
            throw new IllegalArgumentException("Debe especificarse la pregunta original a la que responde");
        }

        nuevaRespuesta.setFecha(LocalDate.now());
        nuevaRespuesta.setHora(LocalTime.now());
        return preguntaRepository.save(nuevaRespuesta);
    }


}
