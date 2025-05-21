package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.CorreoService;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.util.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RegisterController {
    @Autowired
    PersonaService personaService;


    @PreAuthorize("hasRole('PROPIETARIO')")
    @PostMapping("/register/empleado")
    public ResponseEntity<?> registerEmpleado(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Persona persona = personaService.registerNewEmpleado(request);
            response.put("mensaje", "Empleado registrado exitosamente");
            response.put("persona", persona);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            response.put("mensaje", "Error al registrar empleado: " + ex.getMessage());
            //response.put("perso, null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCliente(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Persona persona = personaService.registerNewCliente(request);
            response.put("mensaje", "Cliente registrado exitosamente");
            response.put("persona", persona);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            response.put("mensaje", "Error al registrarse: " + ex.getMessage());
            //response.put("persona", null);
            return ResponseEntity.badRequest().body(response);
        }
    }
}