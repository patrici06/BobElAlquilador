package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.service.CustomUserDetailsService;
import com.BobElAlquilador.demo.service.TwoFaService;
import com.BobElAlquilador.demo.util.JwtUtil;
import com.BobElAlquilador.demo.util.TwoFaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class TwoFaController {
     @Autowired
        private  TwoFaService twoFaService;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/2fa/verify")
    public ResponseEntity<?> verify2fa(@RequestBody TwoFaRequest req){
        if(twoFaService.validateCode(req.getEmail(), req.getCode())){
            UserDetails persona = customUserDetailsService.loadUserByUsername(req.getEmail());
            String jwt = jwtUtil.generateToken(req.getEmail(), persona.getAuthorities());
            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            return  ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Código inválido");
    }
}
