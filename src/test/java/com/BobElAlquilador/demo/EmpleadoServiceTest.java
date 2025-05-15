package com.BobElAlquilador.demo;


import com.BobElAlquilador.demo.model.Empleado;
import com.BobElAlquilador.demo.repository.EmpleadoRepository;
import com.BobElAlquilador.demo.service.EmpleadoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmpleadoServiceTest {

    @Mock
    private EmpleadoRepository empleadoRepository;

    @InjectMocks
    private EmpleadoService empleadoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllEmpleados() {
        // Arrange
        List<Empleado> expectedEmpleados = Arrays.asList(
                new Empleado("12345678", "Juan", "Perez", "juan@example.com", "123456789"),
                new Empleado("87654321", "Maria", "Lopez", "maria@example.com", "987654321")
        );
        when(empleadoRepository.findAll()).thenReturn(expectedEmpleados);

        // Act
        List<Empleado> result = empleadoService.findAllEmpleados();

        // Assert
        assertNotNull(result);
        assertEquals(expectedEmpleados.size(), result.size());
        assertEquals(expectedEmpleados, result);
        verify(empleadoRepository, times(1)).findAll();
    }

    @Test
    void testFindByDniEmpleado_ExistingEmpleado() {
        // Arrange
        String dni = "12345678";
        Empleado expectedEmpleado = new Empleado(dni, "Juan", "Perez", "juan@example.com", "123456789");
        when(empleadoRepository.findById(dni)).thenReturn(Optional.of(expectedEmpleado));

        // Act
        Empleado result = empleadoService.findByDniEmpleado(dni);

        // Assert
        assertNotNull(result);
        assertEquals(expectedEmpleado, result);
        verify(empleadoRepository, times(1)).findById(dni);
    }

    @Test
    void testFindByDniEmpleado_NonExistingEmpleado() {
        // Arrange
        String dni = "87654321";
        when(empleadoRepository.findById(dni)).thenReturn(Optional.empty());

        // Act
        Empleado result = empleadoService.findByDniEmpleado(dni);

        // Assert
        assertNull(result);
        verify(empleadoRepository, times(1)).findById(dni);
    }

    @Test
    void testSaveEmpleado() {
        // Arrange
        Empleado empleado = new Empleado("12345678", "Maria", "Lopez", "maria@example.com", "987654321");

        // Act
        empleadoService.saveEmpleado(empleado);

        // Assert
        verify(empleadoRepository, times(1)).save(empleado);
    }
}