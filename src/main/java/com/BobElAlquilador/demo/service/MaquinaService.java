package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Estado;
import com.BobElAlquilador.demo.model.EstadoMaquina;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.repository.MaquinaRepository;
import com.BobElAlquilador.demo.util.MaquinaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MaquinaService {
    @Autowired
    public MaquinaRepository maquinaRepository;

    public List<Maquina> getAllMaquinas() {
        return maquinaRepository.findAll();
    }

    public List<Maquina> getMaquinasPorTipo(String tipo) {
        return maquinaRepository.findByTipo(tipo);
    }

    public Maquina getMaquinaPorNombre(String nombre) {
        return maquinaRepository.findById(nombre).orElse(null);
    }

    public List<Maquina> getMaquinasPorUbicacion(String ubicacion) {
        return maquinaRepository.findByUbicacion(ubicacion);
    }

    public List<Maquina> getMaquinasDisponibles() {
        return maquinaRepository.findAll().stream()
                .filter(maq -> maq.getEstadoMaquina() == EstadoMaquina.Disponible)
                .toList();
    }

    public Maquina subir(String nombreMaquina,String ubicacion,
                         LocalDate fechaIngreso,String fotoUrl,
                         String descripcion,String tipo, Double precioDia
    ) {
        Maquina nueva = new Maquina(nombreMaquina, ubicacion, fechaIngreso, fotoUrl, descripcion, tipo, precioDia);
        nueva.setEstadoMaquina(EstadoMaquina.Disponible);
        if (this.getMaquinaPorNombre(nombreMaquina) != null) {
            throw new RuntimeException("La maquina '" + nombreMaquina + "' ya se encuentra registrada");
        }
        return maquinaRepository.save(nueva);
    }

    public void saveMaquina(Maquina maquina) {
        maquinaRepository.save(maquina);
    }

    // Borrado Lógico
    public void deleteMaquina(String nomMaquina) {
        Maquina maquina = maquinaRepository.findById(nomMaquina).orElse(null);
        // Se deben Cancelar los alquileres (marcar como cancelado)
        maquina.borrar();
        AlquilerService alquilerService = new AlquilerService();
        alquilerService.cancelarAlquileresMaquina(maquina);
        // Puede que requiera la cancelación de todos los Alquileres pendientes.
        this.saveMaquina(maquina);
    }
}