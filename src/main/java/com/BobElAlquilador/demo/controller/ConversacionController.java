package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Conversacion;
import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Pregunta;
import com.BobElAlquilador.demo.model.Respuesta;
import com.BobElAlquilador.demo.service.ConversacionService;
import com.BobElAlquilador.demo.service.IteradorService;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.repository.PreguntaRepository;
import com.BobElAlquilador.demo.service.RespuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.*;

import java.util.*;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/cliente")
public class ConversacionController {

    @Autowired
    private ConversacionService conversacionService;

    @Autowired
    private IteradorService iteradorService;

    @Autowired
    private PersonaService personaService;

    @Autowired
    private RespuestaService respuestaService;

    @Autowired
    private PreguntaRepository preguntaRepository;

    @PostMapping("/{email}/preguntas")
    public ResponseEntity<?> crearPregunta(@RequestBody String pregunta, @PathVariable String email) {
        try {
            // Buscar la persona en la base de datos
            Persona cliente = personaService.findByEmail(email);
            if (cliente == null) {
                throw new RuntimeException("Cliente no encontrado");
            }

            // Validar la pregunta
            if (pregunta == null || pregunta.length() == 0) {
                throw new RuntimeException("Error, la pregunta no puede estar vacía");
            }
            Conversacion conversacion;
            if ( iteradorService.getAllIteradoresPorCliente(email).isEmpty()){
                conversacion = new Conversacion();
                conversacionService.SubirConversacion(conversacion);
            }else{
                List<Iteracion> iteraciones = iteradorService.getAllIteradoresPorCliente(email);
                conversacion = iteraciones.get(0).getConversacion();
            }
            // Crear una nueva conversación
            // Crear y guardar la pregunta
            Pregunta preg = new Pregunta(cliente, LocalDate.now(), LocalTime.now(), pregunta);
            preg = preguntaRepository.save(preg);
            // Crear la iteración
            Iteracion iteracion = new Iteracion(conversacion, preg, null);
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
            List<Iteracion> preguntas = iteradorService.getAllIteradoresPorCliente(email);
            return ResponseEntity.ok(preguntas);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/preguntas-sin-responder")
    public ResponseEntity<?> obtenerPreguntasSinResponder() {
        try {
            List<Iteracion> preguntas = iteradorService.getAllIteradoresSinRespuesta();
            return ResponseEntity.ok(preguntas);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/conversaciones/{conversacionId}/preguntas/{preguntaId}/respuesta")
    public ResponseEntity<?> responderPregunta(
            @PathVariable Long conversacionId,
            @PathVariable Long preguntaId,
            @RequestBody String respuesta,
            @RequestHeader("Authorization") String token) {
        try {
            // Extraer el email del empleado del token
            String email = "";
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                try {
                    Claims claims = Jwts.parser()
                            .setSigningKey("tu_clave_secreta") // Usar la misma clave que en el JwtUtil
                            .parseClaimsJws(jwtToken)
                            .getBody();
                    email = claims.getSubject();
                } catch (Exception e) {
                    throw new RuntimeException("Token inválido");
                }
            }

            // Buscar el empleado
            Persona empleado = personaService.findByEmail(email);
            if (empleado == null) {
                throw new RuntimeException("Empleado no encontrado");
            }

            // Crear la respuesta
            Respuesta respuestaCreada = respuestaService.responderIteracion(conversacionId, preguntaId, respuesta, empleado);
            return ResponseEntity.ok(respuestaCreada);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
