package com.BobElAlquilador.demo;
import com.BobElAlquilador.demo.model.Cliente;
import com.BobElAlquilador.demo.model.Empleado;
import com.BobElAlquilador.demo.model.Resena;
import com.BobElAlquilador.demo.repository.ResenaRepository;
import com.BobElAlquilador.demo.service.ResenaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ResenaServiceTest {

    @Mock
    private ResenaRepository resenaRepository;

    @InjectMocks
    private ResenaService resenaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindByEmpleadoRena_ExistingEmpleado() {
        // Arrange
        Cliente cliente = new Cliente("45", "joaco", "puto", "nddea@gamil", "12345", "221-564-2132");
        Empleado empleado = new Empleado("12345678", "Juan", "Perez", "juan@example.com", "123456789");
        Resena expectedResena = new Resena(cliente, empleado, "muy bueno", 5);
        when(resenaRepository.findByEmpleado(empleado)).thenReturn(expectedResena);

        // Act
        Resena result = resenaService.findByEmpleadoRena(empleado);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResena, result);
        verify(resenaRepository, times(1)).findByEmpleado(empleado);
    }

    @Test
    void testFindByEmpleadoRena_NonExistingEmpleado() {
        // Arrange
        Empleado empleado = new Empleado("87654321", "Maria", "Lopez", "maria@example.com", "987654321");
        when(resenaRepository.findByEmpleado(empleado)).thenReturn(null);

        // Act
        Resena result = resenaService.findByEmpleadoRena(empleado);

        // Assert
        assertNull(result);
        verify(resenaRepository, times(1)).findByEmpleado(empleado);
    }

    @Test
    void testGetAllResena() {
        // Arrange
        Cliente cliente = new Cliente("45", "joaco", "puto", "nddea@gamil", "12345", "221-564-2132");
        Empleado empleado = new Empleado("12345678", "Juan", "Perez", "juan@example.com", "123456789");
        List<Resena> expectedResenas = Arrays.asList(
                new Resena(cliente, empleado, "bueno", 3),
                new Resena(cliente, empleado, "malo", 2)
        );
        when(resenaRepository.findAll()).thenReturn(expectedResenas);

        // Act
        List<Resena> result = resenaService.getAllResena();

        // Assert
        assertNotNull(result);
        assertEquals(expectedResenas.size(), result.size());
        assertEquals(expectedResenas, result);
        verify(resenaRepository, times(1)).findAll();
    }
}
