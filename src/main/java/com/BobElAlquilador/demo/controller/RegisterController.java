package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.util.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class RegisterController {
    @Autowired
    PersonaService personaService;
    @PreAuthorize("hasRole('PROPIETARIO')")
    @PostMapping("/register/empleado")
    public ResponseEntity<?> registerEmpleado(@RequestBody RegisterRequest request) {
        try {
            Persona persona =  personaService.registerNewEmpleado(request);
            return ResponseEntity.ok(persona);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerCliente(@RequestBody RegisterRequest request) {
        try {
            Persona persona =  personaService.registerNewCliente(request);
            return ResponseEntity.ok(persona);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
