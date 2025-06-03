package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Conversacion;
import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Pregunta;
import com.BobElAlquilador.demo.service.ConversacionService;
import com.BobElAlquilador.demo.service.IteradorService;
import com.BobElAlquilador.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.*;

import java.util.*;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/cliente")
public class ConversacionController {

    @Autowired
    private ConversacionService conversacionService;

    @Autowired
    private IteradorService iteradorService;
    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/{email}/preguntas")
    public ResponseEntity<?> crearPregunta(@RequestBody String pregunta,@PathVariable String email) {
    try {
        // Crear una Persona (cliente) con el email
        Persona cliente = new Persona();
        cliente.setEmail(email);
        // Asignar el cliente a la conversación
        if (pregunta == null || pregunta.length() == 0)
        { throw new RuntimeException("Error, la pregunta no puede estar vacía");}
        List<Iteracion> iter  = iteradorService.getAllIteradoresPorCliente(cliente.getEmail());
        Conversacion conversacion; 
        
        if(iter.isEmpty() || iter == null){
            conversacion = new Conversacion();
        }else{
            conversacion = iter.get(0).getConversacion();
        }
        Pregunta preg = new Pregunta(cliente, LocalDate.now(), LocalTime.now(), pregunta);
        Iteracion iteracion = new Iteracion(conversacion,preg, null);
        iteradorService.subirIterador(iteracion); 
        return ResponseEntity.ok(iteracion);
    } catch (Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}


    // todas las conversaciones de la bd
    @GetMapping("/{email}/preguntas")
    public ResponseEntity<?> obtenerTodas(@PathVariable String email) {
        try {
            List<Iteracion> preguntas  = iteradorService.getAllIteradoresPorCliente(email);
            
            return ResponseEntity.ok(preguntas);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}