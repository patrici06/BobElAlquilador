package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.*;
import com.BobElAlquilador.demo.repository.AlquilerRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.EvaluationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlquilerService {

    @Autowired
    private AlquilerRepository repo;
    @Autowired
    private PersonaService personaService;
    @Autowired
    private MaquinaService maquinaService;

    public Alquiler reservar(String email, String maquinaName, LocalDate inicio, LocalDate fin) {
        // 1. Validar fechas lógicas
        if(fin.isBefore(inicio)) {
            throw new RuntimeException("Rango de fechas invalido");
        }

        // 2. Validar duración mínima (≥ 7 días)
        long dias = ChronoUnit.DAYS.between(inicio, fin);
        if (dias < 7) {
            throw new RuntimeException("Las máquinas se deben alquilar por un mínimo una semana");
        }

        // 3. Validar disponibilidad
        List<Alquiler> solapados = repo.findOverlapping(maquinaName, inicio, fin);
        if (!solapados.isEmpty()) {
            throw new RuntimeException("La máquina no está disponible en las fechas seleccionadas");
        }

        // 4. Crear entidad con estado Pendiente
        Persona cliente = personaService.findByEmail(email);
        if(cliente == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se encontró un cliente con ese email");
        }
        Maquina maquina = maquinaService.getMaquinaPorNombre(maquinaName);
        if(maquina == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se encontro una maquina con ese nombre");
        }
        AlquilerId id = new AlquilerId(maquinaName, inicio, fin);
        Alquiler alquiler = new Alquiler(id, maquina, cliente, maquina.calcularPrecio(dias));
        alquiler.setEstado(EstadoAlquiler.Pendiente);

        return repo.save(alquiler);
    }

    public Alquiler buscarAlquiler(String nombreMaquina, LocalDate inicio, LocalDate fin) {
        return repo.findById(new AlquilerId(nombreMaquina, inicio, fin)).orElse(null);
    }

    public void registrarDevolucion(String nombreMaquina, LocalDate inicio, LocalDate fin) {
        Alquiler alq = buscarAlquiler(nombreMaquina, inicio, fin);
        if (alq == null)
            throw new EntityNotFoundException("La reserva a registrar no fue encontrada");
        if (alq.getEstadoAlquiler() != EstadoAlquiler.Activo)
            throw new IllegalStateException("La reserva no se encuentra activa para devolver");
        alq.setEstado(EstadoAlquiler.Finalizado);
        repo.save(alq);
    }

    public void eliminarAlquiler(String nombreMaquina, LocalDate inicio, LocalDate fin) {
        Alquiler alquiler = repo.findById(new AlquilerId(nombreMaquina, inicio, fin))
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alquiler no encontrado"));

        alquiler.borrarAlquiler(EstadoAlquiler.CanceladoInvoluntario);
        repo.save(alquiler);
        personaService.enviarMailCancelacion(alquiler);
    }

    public List<Alquiler> getAllAlquileres() {
        List<Alquiler> alquileres = repo.findAll();
        //cambioDeEstado(alquileres); <- Comentado porque ahora manejamos los estados a traves de Registrar Retiro/Devolucion
        return alquileres;
    }

    public void cancelarAlquileresMaquina(Maquina maq) {
        List<Alquiler> alquileresMaq = this.getAllAlquileres().stream()
                .filter(alq -> (alq.getMaquina().equals(maq) && alq.getEstadoAlquiler() == EstadoAlquiler.Pendiente))
                .toList();
        alquileresMaq.forEach(alq -> alq.cancelamientoInvoluntario());
        personaService.enviarMailCancelacion(alquileresMaq);
    }

    public List<Alquiler> obtenerReservasActivasOPendientes(String maquinaNombre) {
        return repo.findByMaquinaNombreAndEstadoIn(maquinaNombre, List.of(EstadoAlquiler.Pendiente, EstadoAlquiler.Activo));
    }

    public List<Alquiler> obtenerMisAlquileres(String email) {
        Persona cliente = personaService.findByEmail(email);
        if (cliente == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado");
        }
        String dni = cliente.getDni();
        List<Alquiler> alquileres = repo.findByCliente_Dni(dni);

        //cambioDeEstado(alquileres); <- Comentado porque ahora manejamos los estados a traves de Registrar Retiro/Devolucion
        return alquileres;
    }

    // Metodo obsoleto, no lo borro por las dudas
    private void cambioDeEstado(List<Alquiler> alquileres) {
        LocalDate hoy = LocalDate.now();
        for (Alquiler a : alquileres) {
            LocalDate inicio = a.getAlquilerId().getFechaInicio();
            LocalDate fin = a.getAlquilerId().getFechaFin();

            EstadoAlquiler nuevoEstado;
            if (hoy.isBefore(inicio)) {
                nuevoEstado = EstadoAlquiler.Pendiente;
            } else if ((hoy.isEqual(inicio) || hoy.isAfter(inicio)) && hoy.isBefore(fin.plusDays(1))) {
                nuevoEstado = EstadoAlquiler.Activo;
            } else {
                nuevoEstado = EstadoAlquiler.Finalizado;
            }

            if(!a.getEstadoAlquiler().equals(nuevoEstado)) {
                a.setEstado(nuevoEstado);
                repo.save(a);
            }
        }
    }

    public void saveAlquiler(Alquiler alquiler) {repo.save(alquiler);}
}
