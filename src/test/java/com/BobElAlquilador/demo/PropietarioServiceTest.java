package com.BobElAlquilador.demo;

import com.BobElAlquilador.demo.model.Propietario;
import com.BobElAlquilador.demo.repository.PropietarioRepository;
import com.BobElAlquilador.demo.service.PropietarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PropietarioServiceTest {

    @Mock
    private PropietarioRepository propietarioRepository;

    @InjectMocks
    private PropietarioService propietarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindByDniPropietario_ExistingPropietario() {
        // Arrange
        String dni = "12345678";
        Propietario expectedPropietario = new Propietario(dni, "Carlos", "Gomez", "carlos@example.com", "123456789");
        when(propietarioRepository.findById(dni)).thenReturn(Optional.of(expectedPropietario));

        // Act
        Propietario result = propietarioService.findByDniPropietario(dni);

        // Assert
        assertNotNull(result);
        assertEquals(expectedPropietario, result);
        verify(propietarioRepository, times(1)).findById(dni);
    }

    @Test
    void testFindByDniPropietario_NonExistingPropietario() {
        // Arrange
        String dni = "87654321";
        when(propietarioRepository.findById(dni)).thenReturn(Optional.empty());

        // Act
        Propietario result = propietarioService.findByDniPropietario(dni);

        // Assert
        assertNull(result);
        verify(propietarioRepository, times(1)).findById(dni);
    }

    @Test
    void testSavePropietario() {
        // Arrange
        Propietario propietario = new Propietario("12345678", "Ana", "Martinez", "ana@example.com", "987654321");

        // Act
        propietarioService.savePropietario(propietario);

        // Assert
        verify(propietarioRepository, times(1)).save(propietario);
    }
}