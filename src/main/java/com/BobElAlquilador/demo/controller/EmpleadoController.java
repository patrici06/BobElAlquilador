package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.service.ResenaService;
import jdk.javadoc.doclet.Reporter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/propietario")
public class EmpleadoController {
    @Autowired
    PersonaService personaService;
    @Autowired
    private ResenaService resenaService;

    @GetMapping("/empleados-valoracion")
    public ResponseEntity<?> empleadosValoracion() {
        try {
            return ResponseEntity.ok().body(personaService.EmpleadosOrderByValoracion());
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping ("/empleados-cantidad-alquileres-efectuado")
    public ResponseEntity<?> empleadosCantidadAlquileresEfectuado() {
        try {
            return ResponseEntity.ok().body(personaService.alquileresPorEmpleado());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}
