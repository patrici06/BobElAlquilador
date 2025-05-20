package com.BobElAlquilador.demo;

import com.BobElAlquilador.demo.model.Cliente;
import com.BobElAlquilador.demo.model.Pregunta;
import com.BobElAlquilador.demo.repository.PreguntaRepository;
import com.BobElAlquilador.demo.service.PreguntaService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;

class PreguntaServiceTest {

    @Mock
    private PreguntaRepository preguntaRepository;

    @InjectMocks
    private PreguntaService preguntaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCrearConsultaPersonalizada() {
        Cliente cliente = new Cliente();
        cliente.setNombre("Dolores");
        cliente.setApellido("Garro");

        /*Pregunta pregunta = new Pregunta(cliente, null, null,
            "Hola! Mi nombre es Dolores, quiero preguntar sobre la máquina X");
        */
        Pregunta pregunta = new Pregunta(cliente, null, null,
            "Hola! Mi nombre es Dolores, quiero preguntar sobre la máquina XYZ");
            
        Mockito.when(preguntaRepository.save(Mockito.any(Pregunta.class)))
                .thenAnswer(i -> i.getArguments()[0]);

        Pregunta resultado = preguntaService.crearConsulta(pregunta);

        Assertions.assertEquals("Hola! Mi nombre es Dolores, quiero preguntar sobre la máquina XYZ", resultado.getCuerpo());
        Assertions.assertNotNull(resultado.getFecha());
        Assertions.assertNotNull(resultado.getHora());
    }

    @Test
    void testCrearConsultaVacia() {
    Pregunta pregunta = new Pregunta();
    pregunta.setCuerpo("   "); // solo espacios

    Exception ex = Assertions.assertThrows(IllegalArgumentException.class, () -> {
        preguntaService.crearConsulta(pregunta);
    });

    Assertions.assertEquals("La consulta no puede estar vacía", ex.getMessage());
    Mockito.verify(preguntaRepository, Mockito.never()).save(Mockito.any(Pregunta.class));
}

}
