package com.BobElAlquilador.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/propietario")
public class PropietarioController {
    @Autowired
    PropietarioService propietarioService;
    @GetMapping ("/propietario/list")
    public List<Propietario> listarPropietarios(){
        return this.propietarioService.findAllPropietarios();
    }
    @PostMapping ("/propietario")
    public ResponseEntity<String> savePropietario(@RequestBody Propietario propietario){
        if(propietario != null) {
            this.propietarioService.savePropietario(propietario);
            return ResponseEntity.ok("Propietario guardado");
        }
        return ResponseEntity.badRequest().build();
    }
}
