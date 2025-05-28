package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Conversacion;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.ConversacionService;
import com.BobElAlquilador.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/conversacion")
public class ConversacionController {

    @Autowired
    private ConversacionService conversacionService;

    @Autowired
    private JwtUtil jwtUtil;

    /*@PostMapping("/crear")
    public ResponseEntity<?> crearConversacion(@RequestBody Conversacion conversacion) {
        try {
            Conversacion nuevaConversacion = conversacionService.crearConversacion(conversacion);
            return ResponseEntity.ok(nuevaConversacion);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }*/

    @PostMapping("/crear")
    public ResponseEntity<?> crearConversacion(@RequestBody Conversacion conversacion, @RequestHeader("Authorization") String authHeader) {
    try {
        // Extraer el email del JWT
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token); 

        // Crear una Persona (cliente) con el email
        Persona cliente = new Persona();
        cliente.setEmail(email);

        // Asignar el cliente a la conversación
        conversacion.setCliente(cliente);

        // Crear la conversación
        Conversacion nuevaConversacion = conversacionService.crearConversacion(conversacion);

        return ResponseEntity.ok(nuevaConversacion);
    } catch (Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}


    // todas las conversaciones de la bd
    @GetMapping("/listar-conversaciones")
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<Conversacion> conversaciones = conversacionService.obtenerTodas();
            return ResponseEntity.ok(conversaciones);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Conversacion conversacion = conversacionService.obtenerPorId(id);
            return ResponseEntity.ok(conversacion);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // se accede por email!
    @GetMapping("/cliente/{email}")
    public ResponseEntity<?> obtenerPorCliente(@PathVariable String email) {
        try {
            Persona cliente = new Persona();
            cliente.setEmail(email);
            List<Conversacion> conversaciones = conversacionService.obtenerPorCliente(cliente);
            return ResponseEntity.ok(conversaciones);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // se accede por email!
    @GetMapping("/empleado/{email}")
    public ResponseEntity<?> obtenerPorEmpleado(@PathVariable String email) {
        try {
            Persona empleado = new Persona();
            empleado.setEmail(email);
            List<Conversacion> conversaciones = conversacionService.obtenerPorEmpleado(empleado);
            return ResponseEntity.ok(conversaciones);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<?> borrarConversacion(@PathVariable Long id) {
        try {
            Conversacion conversacion = conversacionService.obtenerPorId(id);
            conversacionService.borrarConversacion(conversacion);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Conversación eliminada correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/pendientes")
    public ResponseEntity<?> obtenerConversacionesPendientes() {
        //try {
            List<Conversacion> pendientes = conversacionService.obtenerConversacionesPendientesEmpleado();
            return ResponseEntity.ok(pendientes);
        /* } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }*/
    }
}
