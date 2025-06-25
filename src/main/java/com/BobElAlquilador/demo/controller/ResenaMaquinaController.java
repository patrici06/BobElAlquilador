package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.ResenaMaquina;
import com.BobElAlquilador.demo.service.ResenaMaquinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/resena/maquina")
public class ResenaMaquinaController {
    @Autowired
    private ResenaMaquinaService resenaMaquinaService;

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMaquina(@PathVariable long id) {
        try {
            ResenaMaquina res = resenaMaquinaService.getResenaMaquinaPorId(id);
            resenaMaquinaService.eliminarResenaMaquina(res);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Reseña de la máquina '" + res.getMaquina().getNombre() + "' eliminada con éxito.");
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al eliminar la reseña de maquina: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
