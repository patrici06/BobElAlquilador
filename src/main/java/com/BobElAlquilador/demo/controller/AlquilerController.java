package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Alquiler;
import com.BobElAlquilador.demo.service.AlquilerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/alquileres")
public class AlquilerController {

    @Autowired
    private AlquilerService service;

    @PostMapping("/reservar")
    public ResponseEntity<Alquiler> reservar(
            @RequestParam String clienteDni,
            @RequestParam String maquina,
            //@DateTimeFormat convierte cadenas ISO a LocalDate.
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        Alquiler nuevo = service.reservar(clienteDni, maquina, fechaInicio, fechaFin);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

}
