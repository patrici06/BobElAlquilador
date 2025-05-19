package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.AuthService;
import com.BobElAlquilador.demo.util.JwtUtil;
import com.BobElAlquilador.demo.util.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Persona user = authService.authenticate(loginRequest.getDni(), loginRequest.getClave());
        if (user == null) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
        String token = jwtUtil.generateToken(loginRequest.getDni());
        return ResponseEntity.ok().body("{\"token\": \"" + token + "\"}");
    }
}