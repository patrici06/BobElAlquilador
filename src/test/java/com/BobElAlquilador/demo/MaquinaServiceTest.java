package com.BobElAlquilador.demo;

import com.BobElAlquilador.demo.model.Estado;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.repository.MaquinaRepository;
import com.BobElAlquilador.demo.service.MaquinaService;
import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MaquinaServiceTest {

    @Mock
    private MaquinaRepository maquinaRepository;

    @InjectMocks
    private MaquinaService maquinaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetMaquinasPorTipo() {
        // Configurar datos de prueba
        String tipo = "Industrial";
        List<Maquina> expectedMaquinas = new ArrayList<>();
        expectedMaquinas.add(new Maquina("Excavadora", "Madrid", LocalDate.now(), "nase", "nashe", tipo));
        expectedMaquinas.add(new Maquina("Bulldozer", "Argentina", LocalDate.now(), "ndea", "dou", tipo));
        when(maquinaRepository.findByTipo(tipo)).thenReturn(expectedMaquinas);

        // Ejecutar el método
        List<Maquina> actualMaquinas = maquinaService.getMaquinasPorTipo(tipo);

        // Verificar resultados
        assertEquals(expectedMaquinas.size(), actualMaquinas.size());
        assertEquals(expectedMaquinas, actualMaquinas);
        verify(maquinaRepository, times(1)).findByTipo(tipo);
    }

    @Test
    void testGetMaquinaPorNombre() {
        // Configurar datos de prueba
        String nombre = "Excavadora";
        Maquina expectedMaquina = new Maquina(nombre, "Madrid", LocalDate.now(), "nase", "nashe", "Industrial");
        when(maquinaRepository.findById(nombre)).thenReturn(Optional.of(expectedMaquina));

        // Ejecutar el método
        Maquina actualMaquina = maquinaService.getMaquinaPorNombre(nombre);

        // Verificar resultados
        assertNotNull(actualMaquina);
        assertEquals(expectedMaquina, actualMaquina);
        verify(maquinaRepository, times(1)).findById(nombre);
    }

    @Test
    void testGetMaquinaPorNombreNotFound() {
        // Configurar datos de prueba
        String nombre = "Excavadora";
        when(maquinaRepository.findById(nombre)).thenReturn(Optional.empty());

        // Ejecutar el método
        Maquina actualMaquina = maquinaService.getMaquinaPorNombre(nombre);

        // Verificar resultados
        assertNull(actualMaquina);
        verify(maquinaRepository, times(1)).findById(nombre);
    }

    @Test
    void testGetMaquinasPorUbicacion() {
        // Configurar datos de prueba
        String ubicacion = "Madrid";
        List<Maquina> expectedMaquinas = new ArrayList<>();
        expectedMaquinas.add(new Maquina("Excavadora", ubicacion, LocalDate.now(), "nase", "nashe", "Industrial"));
        expectedMaquinas.add(new Maquina("Bulldozer", "Argentina", LocalDate.now(), "ndea", "dou", "Agronoma"));
        when(maquinaRepository.findByUbicacion(ubicacion)).thenReturn(expectedMaquinas);

        // Ejecutar el método
        List<Maquina> actualMaquinas = maquinaService.getMaquinasporUbicacion(ubicacion);

        // Verificar resultados
        assertEquals(expectedMaquinas.size(), actualMaquinas.size());
        assertEquals(expectedMaquinas, actualMaquinas);
        verify(maquinaRepository, times(1)).findByUbicacion(ubicacion);
    }

    @Test
    void testSaveMaquina() {
        // Configurar datos de prueba
        Maquina maquina = new Maquina("Excavadora", "Madrid", LocalDate.now(), "nase", "nashe", "Industrial");

        // Ejecutar el método
        maquinaService.saveMaquina(maquina);

        // Verificar resultados
        verify(maquinaRepository, times(1)).save(maquina);
    }

    @Test
    void testDeleteMaquina() {
        // Configurar datos de prueba
        Maquina maquina = new Maquina("Excavadora", "Madrid", LocalDate.now(), "nase", "nashe", "Industrial");

        // Ejecutar el método
        maquinaService.deleteMaquina(maquina);

        // Verificar resultados
        assertEquals(Estado.Eliminada, maquina.getEstado());
    }
}
