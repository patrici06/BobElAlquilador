package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Mensaje;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.BobElAlquilador.demo.service.MensajeService;

import java.util.*;

@RestController
@RequestMapping("/mensaje")
public class MensajeController {

    @Autowired
    private MensajeService mensajeService;

    @PostMapping("/crear/{idConversacion}")
    public ResponseEntity<?> crearMensaje(@PathVariable Long idConversacion, @RequestBody Mensaje mensaje) {
        try {
            Mensaje nuevoMensaje = mensajeService.crearMensaje(idConversacion, mensaje);
            return ResponseEntity.ok(nuevoMensaje);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/conversacion/{idConversacion}")
    public ResponseEntity<?> obtenerMensajesDeConversacion(@PathVariable Long idConversacion) {
        try {
            List<Mensaje> mensajes = mensajeService.obtenerMensajesDeConversacion(idConversacion);
            return ResponseEntity.ok(mensajes);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /*@DeleteMapping("/borrar/{id}")
    public ResponseEntity<?> borrarMensaje(@PathVariable Long id) {
        try {
            Mensaje mensaje = mensajeService.obtenerPorId(id);
            mensajeService.borrarMensaje(mensaje);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Mensaje eliminado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }*/

@GetMapping("/mensajes")
public ResponseEntity<List<Mensaje>> obtenerMensajes() {
    return ResponseEntity.ok(mensajeService.obtenerTodosLosMensajes());
}

}

