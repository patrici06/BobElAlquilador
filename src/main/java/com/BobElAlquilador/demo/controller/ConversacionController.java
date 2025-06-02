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

    @PostMapping("/{email}/preguntas")
    public ResponseEntity<?> crearPregunta(@RequestBody Pregunta pregunta,@PathVariable String email) {
    try {
        // Crear una Persona (cliente) con el email
        Persona cliente = new Persona();
        cliente.setEmail(email);
        // Asignar el cliente a la conversación
        if (pregunta == null || pregunta.getCliente() == null || pregunta.getCliente().getEmail() == null )
        { throw new RuntimeException("Error inesperado, algo fallo en la pregunta");}
        List<Iteracion> iter  = iteradorService.getAllIteradoresPorCliente(pregunta.getCliente().getEmail());
        Conversacion conversacion; 
        
        if(iter.isEmpty() || iter == null){
            conversacion = new Conversacion();
        }else{
            conversacion = iter.get(0).getConversacion();
        }
        Iteracion iteracion = new Iteracion(conversacion,pregunta, null);
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

    // @GetMapping("/{id}")
    // public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
    //     try {
    //         Conversacion conversacion = conversacionService.obtenerPorId(id);
    //         return ResponseEntity.ok(conversacion);
    //     } catch (Exception ex) {
    //         Map<String, String> response = new HashMap<>();
    //         response.put("mensaje", ex.getMessage());
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    //     }
    // }

    // se accede por email!
    

    // se accede por email!
    // @GetMapping("/empleado/{email}")
    // public ResponseEntity<?> obtenerPorEmpleado(@PathVariable String email) {
    //     try {
    //         Persona empleado = new Persona();
    //         empleado.setEmail(email);
    //         List<Conversacion> conversaciones = conversacionService.obtenerPorEmpleado(empleado);
    //         return ResponseEntity.ok(conversaciones);
    //     } catch (Exception ex) {
    //         Map<String, String> response = new HashMap<>();
    //         response.put("mensaje", ex.getMessage());
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    //     }
    // }

    // @DeleteMapping("/borrar/{id}")
    // public ResponseEntity<?> borrarConversacion(@PathVariable Long id) {
    //     try {
    //         Conversacion conversacion = conversacionService.obtenerPorId(id);
    //         conversacionService.borrarConversacion(conversacion);
    //         Map<String, String> response = new HashMap<>();
    //         response.put("mensaje", "Conversación eliminada correctamente");
    //         return ResponseEntity.ok(response);
    //     } catch (Exception ex) {
    //         Map<String, String> response = new HashMap<>();
    //         response.put("mensaje", ex.getMessage());
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    //     }
    // }
    // @GetMapping("/pendientes")
    // public ResponseEntity<?> obtenerConversacionesPendientes() {
    //     //try {
    //         List<Conversacion> pendientes = conversacionService.obtenerConversacionesPendientesEmpleado();
    //         return ResponseEntity.ok(pendientes);
    //     /* } catch (Exception ex) {
    //         Map<String, String> response = new HashMap<>();
    //         response.put("mensaje", ex.getMessage());
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    //     }*/
    // }
}
