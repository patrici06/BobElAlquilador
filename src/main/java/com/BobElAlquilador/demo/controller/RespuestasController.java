package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Respuesta;
import com.BobElAlquilador.demo.repository.PreguntaRepository;
import com.BobElAlquilador.demo.service.ConversacionService;
import com.BobElAlquilador.demo.service.IteradorService;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.service.RespuestaService;
import com.BobElAlquilador.demo.util.RespuestaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/empleado")
public class RespuestasController {
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

    @GetMapping("/preguntas-sin-responder")
    public ResponseEntity<?> obtenerPreguntasSinResponder() {
        try {
            List<Iteracion> preguntas = iteradorService.getAllIteradores();
            return ResponseEntity.ok(preguntas);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/conversaciones/preguntas/{preguntaId}/respuesta")
    public ResponseEntity<?> responderPreguntaV2(
            @PathVariable Long preguntaId,
            @RequestBody Map<String, String> body) {
        try {
            System.out.println("preguntaId recibido: " + preguntaId);
            String mensaje = body.get("respuesta"); // igual al nombre enviado desde React
            String email = body.get("email");
            Persona empleado = personaService.findByEmail(email);
            if (empleado == null) {
                throw new RuntimeException("Empleado no encontrado");
            }
            Respuesta res = new Respuesta(empleado, LocalDate.now(), LocalTime.now(), mensaje);
            respuestaService.save(res);
            Iteracion it = iteradorService.findByIdPregunta(preguntaId).orElse(null);
            if (it == null) { throw new RuntimeException("Iterador no encontrado error inesperado"); }
            it.setRespuesta(res);
            iteradorService.subirIterador(it);
            return ResponseEntity.ok(res);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

}
