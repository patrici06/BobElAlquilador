package com.BobElAlquilador.demo;

import com.BobElAlquilador.demo.model.Empleado;
import com.BobElAlquilador.demo.model.Pregunta;
import com.BobElAlquilador.demo.model.Respuesta;
import com.BobElAlquilador.demo.repository.PreguntaRepository;
import com.BobElAlquilador.demo.repository.RespuestaRepository;
import com.BobElAlquilador.demo.service.RespuestaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RespuestaServiceTest {

    @Mock
    private RespuestaRepository respuestaRepository;

    @Mock
    private PreguntaRepository preguntaRepository;

    @InjectMocks
    private RespuestaService respuestaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Rta valida
    @Test
    void testResponderPreguntaCorrectamente() {
        Long idPregunta = 1L;
        Empleado empleado = new Empleado();
        Pregunta pregunta = new Pregunta();
        pregunta.setIdP(idPregunta);

        Respuesta respuesta = new Respuesta();
        respuesta.setCuerpo("La maquina X estará disponible la proxima semana");
        respuesta.setEmpleado(empleado);

        when(preguntaRepository.findById(idPregunta)).thenReturn(Optional.of(pregunta));
        when(respuestaRepository.save(any(Respuesta.class))).thenAnswer(i -> i.getArguments()[0]);

        Respuesta resultado = respuestaService.responderPregunta(idPregunta, respuesta);

        assertNotNull(resultado);
        assertEquals("La máquina XYZ estará disponible la semana próxima.", resultado.getCuerpo());
        assertNotNull(resultado.getFecha());
        assertNotNull(resultado.getHora());

        verify(respuestaRepository, times(1)).save(any(Respuesta.class));
        verify(preguntaRepository, times(1)).save(pregunta);
    }

    // Preg ya respondida
    @Test
    void testResponderPreguntaYaRespondida() {
        Long idPregunta = 2L;
        Pregunta pregunta = new Pregunta();
        pregunta.setIdP(idPregunta);
        pregunta.setRespuesta(new Respuesta());

        Respuesta nuevaRespuesta = new Respuesta();
        nuevaRespuesta.setCuerpo("Respuesta nueva");

        when(preguntaRepository.findById(idPregunta)).thenReturn(Optional.of(pregunta));

        Exception ex = assertThrows(IllegalStateException.class, () -> {
            respuestaService.responderPregunta(idPregunta, nuevaRespuesta);
        });

        assertEquals("La consulta ya fue respondida", ex.getMessage());
        verify(respuestaRepository, never()).save(any());
    }

    // Rta vacia
    @Test
    void testResponderConCuerpoVacio() {
        Long idPregunta = 3L;
        Pregunta pregunta = new Pregunta();
        pregunta.setIdP(idPregunta);

        Respuesta respuesta = new Respuesta();
        respuesta.setCuerpo("  "); // vacía

        when(preguntaRepository.findById(idPregunta)).thenReturn(Optional.of(pregunta));

        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            respuestaService.responderPregunta(idPregunta, respuesta);
        });

        assertEquals("Las respuestas no pueden estar vacías", ex.getMessage());
        verify(respuestaRepository, never()).save(any());
    }
}
