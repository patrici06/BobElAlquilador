package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.util.JwtUtil;
import com.BobElAlquilador.demo.service.CustomUserDetailsService;
import com.BobElAlquilador.demo.util.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getDni(), loginRequest.getClave())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getDni());
        String jwt = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());
        return "{\"token\": \"" + jwt + "\"}";
    }
}