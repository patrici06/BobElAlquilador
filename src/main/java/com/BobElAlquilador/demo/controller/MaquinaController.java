package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.EstadoMaquina;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.service.MaquinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/maquinas")
public class MaquinaController {
    @Autowired
    private MaquinaService maquinaService;

    @PostMapping("/subir")
    public ResponseEntity<Maquina> subirMaquina(
            @RequestParam String nombre_maquina,
            @RequestParam String ubicacion,
            //@DateTimeFormat convierte cadenas ISO a LocalDate.{
            @RequestParam @DateTimeFormat LocalDate fecha_ingreso,
            @RequestParam String fotoUrl,
            @RequestParam String descripcion,
            @RequestParam String tipo,
            @RequestParam double precio_dia) {
        Maquina nueva = maquinaService.subir(nombre_maquina, ubicacion, fecha_ingreso, fotoUrl, descripcion, tipo, precio_dia);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }
}