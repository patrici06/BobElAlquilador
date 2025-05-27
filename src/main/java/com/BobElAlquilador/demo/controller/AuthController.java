package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.CorreoService;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.service.TwoFaService;
import com.BobElAlquilador.demo.util.JwtUtil;
import com.BobElAlquilador.demo.service.CustomUserDetailsService;
import com.BobElAlquilador.demo.util.LoginRequest;
import com.BobElAlquilador.demo.util.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
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
    @Autowired
    private CorreoService correoService;
    @Autowired
    private TwoFaService twoFaService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Proceso habitual de autenticación
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getClave())
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            //boolean esPropietario = userDetails.getAuthorities().stream()
            //        .map(GrantedAuthority::getAuthority)
            //        .anyMatch(auth -> auth.equals("ROLE_PROPIETARIO"));

            //if (esPropietario) {
            //    String code = twoFaService.generarYEnviarCodigo(loginRequest.getEmail());
            //    return ResponseEntity.status(206).body("Se envió un código a su email");
            //}
            String jwt = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());
            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            // Siempre responde con JSON: {"mensaje": "..."}
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage()); // O tu mensaje personalizado
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

}