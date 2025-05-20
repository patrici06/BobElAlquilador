package com.BobElAlquilador.demo;

import com.BobElAlquilador.demo.model.Cliente;
import com.BobElAlquilador.demo.model.Pregunta;
import com.BobElAlquilador.demo.repository.PreguntaRepository;
import com.BobElAlquilador.demo.service.PreguntaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class RespuestaDelClienteTest {

    @Mock
    private PreguntaRepository preguntaRepository;

    @InjectMocks
    private PreguntaService preguntaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCrearRespuestaDelClienteExitosa() {
        Pregunta preguntaOriginal = new Pregunta();
        preguntaOriginal.setIdP(1L);

        Cliente cliente = new Cliente();
        cliente.setNombre("Dolores");

        Pregunta respuestaDelCliente = new Pregunta();
        respuestaDelCliente.setCliente(cliente);
        respuestaDelCliente.setCuerpo("Gracias por su respuesta, tengo otra duda.");
        respuestaDelCliente.setPreguntaOriginal(preguntaOriginal);

        when(preguntaRepository.save(any(Pregunta.class))).thenAnswer(i -> i.getArguments()[0]);

        Pregunta resultado = preguntaService.crearRespuestaDelCliente(respuestaDelCliente);

        assertEquals("Gracias por su respuesta, tengo otra duda.", resultado.getCuerpo());
        assertNotNull(resultado.getFecha());
        assertNotNull(resultado.getHora());
        assertEquals(preguntaOriginal, resultado.getPreguntaOriginal());

        verify(preguntaRepository, times(1)).save(any(Pregunta.class));
    }

    @Test
    void testCrearRespuestaDelClienteSinCuerpo() {
        Pregunta respuestaDelCliente = new Pregunta();
        respuestaDelCliente.setCuerpo("  "); // vacío
        respuestaDelCliente.setPreguntaOriginal(new Pregunta());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            preguntaService.crearRespuestaDelCliente(respuestaDelCliente);
        });

        assertEquals("La respuesta del cliente no puede estar vacía", exception.getMessage());
        verify(preguntaRepository, never()).save(any(Pregunta.class));
    }

    @Test
    void testCrearRespuestaDelClienteSinPreguntaOriginal() {
        Pregunta respuestaDelCliente = new Pregunta();
        respuestaDelCliente.setCuerpo("Otra duda más.");

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            preguntaService.crearRespuestaDelCliente(respuestaDelCliente);
        });

        assertEquals("Debe especificarse la pregunta original a la que responde", exception.getMessage());
        verify(preguntaRepository, never()).save(any(Pregunta.class));
    }
}
