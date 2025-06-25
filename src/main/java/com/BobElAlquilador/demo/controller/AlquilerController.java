package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Alquiler;
import com.BobElAlquilador.demo.model.EstadoAlquiler;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.AlquilerService;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alquileres")
public class AlquilerController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PersonaService personaService;

    @Autowired
    private AlquilerService service;

    @PostMapping("/reservar")
    public ResponseEntity<?> reservar(
            @RequestParam String email,
            @RequestParam String maquina,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            Alquiler nuevo = service.reservar(email, maquina, fechaInicio, fechaFin);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ocupadas")
    public ResponseEntity<?> obtenerFechasOcupadas(
            @RequestParam String maquina) {
        try {
            List<Alquiler> reservas = service.obtenerReservasActivasOPendientes(maquina);
            return ResponseEntity.ok(reservas.stream()
                    .map(a -> Map.of(
                            "inicio", a.getAlquilerId().getFechaInicio(),
                            "fin", a.getAlquilerId().getFechaFin()))
                    .toList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener fechas ocupadas: " + e.getMessage());
        }
    }

    @GetMapping("/mis-alquileres")
    public ResponseEntity<?> obtenerMisAlquileres(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token no proporcionado o mal formado");
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.getEmailFromToken(token);

            Persona persona = personaService.findByEmail(email);
            if (persona == null) {
                return ResponseEntity.status(404).body("Persona no encontrada");
            }

            List<Alquiler> misAlquileres = service.obtenerMisAlquileres(email);

            return ResponseEntity.ok(misAlquileres);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener los alquileres: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{nombreMaquina}")
    public void eliminarAlquiler(
            @PathVariable String nombreMaquina,
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        service.eliminarAlquiler(nombreMaquina, inicio, fin);
    }

    @GetMapping("/todos-los-alquileres")
    public ResponseEntity<?> obtenerAlquileres(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token no proporcionado o mal formado");
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.getEmailFromToken(token);

            Persona persona = personaService.findByEmail(email);
            if (persona == null) {
                return ResponseEntity.status(404).body("Persona no encontrada");
            }

            List<Alquiler> alquileres = service.getAllAlquileres();

            return ResponseEntity.ok(alquileres);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener los alquileres: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PROPIETARIO')")
    @GetMapping("/mas-alquiladas")
    public ResponseEntity<?> obtenerMaquinasMasAlquiladas(
        @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
        @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

    if (fechaInicio == null || fechaFin == null || fechaInicio.isAfter(fechaFin)) {
        return ResponseEntity.badRequest().body(Map.of("mensaje", "El rango de fechas es inválido"));
    }

    List<AlquilerService.MaquinaAlquilerCount> resultado = service.obtenerMaquinasMasAlquiladas(fechaInicio, fechaFin);
    return ResponseEntity.ok(resultado); // Si no hay resultados, devuelve []
    }

}


