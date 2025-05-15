package com.BobElAlquilador.demo;

import com.BobElAlquilador.demo.model.Cliente;
import com.BobElAlquilador.demo.repository.ClienteRepository;
import com.BobElAlquilador.demo.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindByDniCliente_ExistingCliente() {
        // Arrange
        String dni = "12345678";
        Cliente expectedCliente = new Cliente(dni, "Juan", "Perez", "juan@example.com", "clave123", "123456789");
        when(clienteRepository.findById(dni)).thenReturn(Optional.of(expectedCliente));

        // Act
        Cliente result = clienteService.findByDniCliente(dni);

        // Assert
        assertNotNull(result);
        assertEquals(expectedCliente, result);
        verify(clienteRepository, times(1)).findById(dni);
    }

    @Test
    void testFindByDniCliente_NonExistingCliente() {
        // Arrange
        String dni = "87654321";
        when(clienteRepository.findById(dni)).thenReturn(Optional.empty());

        // Act
        Cliente result = clienteService.findByDniCliente(dni);

        // Assert
        assertNull(result);
        verify(clienteRepository, times(1)).findById(dni);
    }

    @Test
    void testSaveCliente() {
        // Arrange
        Cliente cliente = new Cliente("12345678", "Maria", "Lopez", "maria@example.com", "clave456", "987654321");

        // Act
        clienteService.saveCliente(cliente);

        // Assert
        verify(clienteRepository, times(1)).save(cliente);
    }
}