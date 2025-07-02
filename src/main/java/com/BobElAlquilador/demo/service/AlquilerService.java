package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.*;
import com.BobElAlquilador.demo.repository.AlquilerRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public void eliminarAlquiler(String nombreMaquina, LocalDate inicio, LocalDate fin) {
        Alquiler alquiler = repo.findById(new AlquilerId(nombreMaquina, inicio, fin))
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alquiler no encontrado"));

        alquiler.borrarAlquiler(EstadoAlquiler.CanceladoInvoluntario);
        repo.save(alquiler);
        personaService.enviarMailCancelacion(alquiler);
    }

    public List<Alquiler> getAllAlquileres() {
        List<Alquiler> alquileres = repo.findAll();
        cambioDeEstado(alquileres);
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

        cambioDeEstado(alquileres);
        // Filtrar los eliminados/cancelados involuntarios
        return alquileres.stream()
            .filter(a -> a.getEstado() == Estado.Activo && a.getEstadoAlquiler() != EstadoAlquiler.CanceladoInvoluntario)
            .toList();
        //return alquileres;
    }

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


    public static class MaquinaAlquilerCount {
        private String nombreMaquina;
        private long cantidad;

        public MaquinaAlquilerCount(String nombreMaquina, long cantidad) {
            this.nombreMaquina = nombreMaquina;
            this.cantidad = cantidad;
        }

        public String getNombreMaquina() {
            return nombreMaquina;
        }

        public long getCantidad() {
            return cantidad;
        }
    }

    public List<MaquinaAlquilerCount> obtenerMaquinasMasAlquiladas(LocalDate fechaInicio, LocalDate fechaFin) {
    return repo.findAll().stream()
        .filter(a -> !a.getAlquilerId().getFechaInicio().isAfter(fechaFin) &&
                     !a.getAlquilerId().getFechaFin().isBefore(fechaInicio))
        .collect(Collectors.groupingBy(a -> a.getMaquina().getNombre(), Collectors.counting()))
        .entrySet().stream()
        .map(e -> new MaquinaAlquilerCount(e.getKey(), e.getValue()))
        .sorted((a, b) -> Long.compare(b.getCantidad(), a.getCantidad()))
        .collect(Collectors.toList());
    }

    /**
     * Cancela un alquiler solo si la fecha actual es anterior a la fecha de inicio (para clientes)
     */
    public double cancelarAlquilerCliente(String nombreMaquina, LocalDate inicio, LocalDate fin) {
        Alquiler alquiler = repo.findById(new AlquilerId(nombreMaquina, inicio, fin))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alquiler no encontrado"));
        LocalDate hoy = LocalDate.now();
        if (!hoy.isBefore(inicio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede cancelar la reserva debido a que se encuentra en curso");
        }
        // Usar estado Cancelado para cancelación voluntaria
        alquiler.borrarAlquiler(EstadoAlquiler.Cancelado);
        repo.save(alquiler);
        // Enviar mail de cancelación voluntaria
        personaService.correoService.enviarCancelacionCliente(alquiler.getPersona().getEmail(), alquiler);
        // Devuelvo el porcentaje de reintegro de la máquina
        return alquiler.getMaquina().getPorcentajeReembolso();
    }

}
