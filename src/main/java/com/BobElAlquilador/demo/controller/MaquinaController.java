package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.service.MaquinaService;
import com.BobElAlquilador.demo.util.MaquinaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class MaquinaController {
    @Autowired
    private MaquinaService maquinaService;

    @PostMapping("/propietario/subirMaquina")
    public ResponseEntity<?> subirMaquina(@RequestBody MaquinaRequest maquinaRequest) {
        try {
            // Ahora el método subir recibe el objeto MaquinaRequest completo (camelCase)
            Maquina nueva = maquinaService.subir(maquinaRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al subir maquina: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}