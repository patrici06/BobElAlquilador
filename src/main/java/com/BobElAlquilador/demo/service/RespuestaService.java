package com.BobElAlquilador.demo.service;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BobElAlquilador.demo.model.Pregunta;
import com.BobElAlquilador.demo.model.Respuesta;
import com.BobElAlquilador.demo.repository.PreguntaRepository;
import com.BobElAlquilador.demo.repository.RespuestaRepository;

@Service
public class RespuestaService {

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private PreguntaRepository preguntaRepository;

    public Respuesta responderPregunta(Long preguntaId, Respuesta respuesta) {
        Pregunta pregunta = preguntaRepository.findById(preguntaId)
                .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada"));

        if (pregunta.getRespuesta() != null) {
            throw new IllegalStateException("La consulta ya fue respondida");
        }

        if (respuesta.getCuerpo() == null || respuesta.getCuerpo().isBlank()) {
            throw new IllegalArgumentException("Las respuestas no pueden estar vacías");
        }

        respuesta.setFecha(LocalDate.now());
        respuesta.setHora(LocalTime.now());
        Respuesta respuestaGuardada = respuestaRepository.save(respuesta);

        pregunta.setRespuesta(respuestaGuardada);
        preguntaRepository.save(pregunta);

        return respuestaGuardada;
    }

    public Pregunta responderEmpleado(Long idPreguntaOriginal, Pregunta nuevaPregunta) {
        Pregunta preguntaOriginal = preguntaRepository.findById(idPreguntaOriginal)
                .orElseThrow(() -> new IllegalArgumentException("Consulta no encontrada"));

        if (preguntaOriginal.getCliente() == null || !preguntaOriginal.getCliente().equals(nuevaPregunta.getCliente())) {
            throw new IllegalStateException("No puede responder una consulta ajena");
        }

        if (preguntaOriginal.getRespuesta() == null) {
            throw new IllegalStateException("La consulta aún no fue respondida por un empleado");
        }

        if (preguntaOriginal.getRespuestaDelCliente() != null) {
            throw new IllegalStateException("Ya respondiste a esta respuesta");
        }

        if (nuevaPregunta.getCuerpo() == null || nuevaPregunta.getCuerpo().isBlank()) {
            throw new IllegalArgumentException("La respuesta no puede estar vacía");
        }

        nuevaPregunta.setFecha(LocalDate.now());
        nuevaPregunta.setHora(LocalTime.now());
        nuevaPregunta.setPreguntaOriginal(preguntaOriginal);
        Pregunta guardada = preguntaRepository.save(nuevaPregunta);

        preguntaOriginal.setRespuestaDelCliente(guardada);
        preguntaRepository.save(preguntaOriginal);

        return guardada;
}





}

