package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.util.JwtUtil;
import com.BobElAlquilador.demo.service.CustomUserDetailsService;
import com.BobElAlquilador.demo.util.LoginRequest;
import com.BobElAlquilador.demo.util.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private PersonaService personaService;

    @GetMapping("/login")
    public String login() {
        return "login";
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Proceso habitual de autenticación
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getDni(), loginRequest.getClave())
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getDni());
            String jwt = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            // Si las credenciales son inválidas, devolver 401
            System.out.println("Error durante login: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }

    @PostMapping("/register/cliente")
    public ResponseEntity<?> registerCliente(@RequestBody RegisterRequest request) {
        try {
            Persona persona =  personaService.registerNewCliente(request);
            return ResponseEntity.ok(persona);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}