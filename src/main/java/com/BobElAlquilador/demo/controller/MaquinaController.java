package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.EstadoMaquina;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.service.MaquinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class MaquinaController {
    @Autowired
    private MaquinaService maquinaService;

    @PostMapping("/propietario/subirMaquina")
    public ResponseEntity<?> subirMaquina(
            @RequestParam String nombre_maquina,
            @RequestParam String ubicacion,
            //@DateTimeFormat convierte cadenas ISO a LocalDate.{
            @RequestParam @DateTimeFormat LocalDate fecha_ingreso,
            @RequestParam String fotoUrl,
            @RequestParam String descripcion,
            @RequestParam String tipo,
            @RequestParam double precio_dia) {

        try {
            Maquina nueva = maquinaService.subir(nombre_maquina, ubicacion, fecha_ingreso, fotoUrl, descripcion, tipo, precio_dia);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al subir maquina: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

}