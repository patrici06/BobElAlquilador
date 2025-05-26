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

@CrossOrigin(origins = "http://localhost:3000")
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

    @GetMapping("/api/maquinas")
    public ResponseEntity<?> obtenerMaquinas() {
        try {
            return ResponseEntity.ok(maquinaService.getAllMaquinas());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener máquinas: " + e.getMessage());
        }
    }

    // Este metodo usa el nombre de la maq, pero es completamente arbitrario, cambiar a conveniencia
    // siempre teniendo en cuenta las repercusiones dentro de maquinaService
    @DeleteMapping("/reservar")
    public ResponseEntity<?> eliminarMaquina(@PathVariable String nombre) {
        try {
            maquinaService.deleteMaquina(nombre);
            return ResponseEntity.status(HttpStatus.OK).body("Máquina '" + nombre + "' eliminada con éxito.");
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al eliminar maquina" + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}