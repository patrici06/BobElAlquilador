package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Alquiler;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.AlquilerService;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

}
