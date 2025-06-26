package com.BobElAlquilador.demo.controller;


import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Resena;
import com.BobElAlquilador.demo.repository.PersonaRepository;
import com.BobElAlquilador.demo.service.ResenaService;
import com.BobElAlquilador.demo.util.ResenaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class ResenaAEmpleadoController {
    @Autowired
    ResenaService resenaService;
    @Autowired
    PersonaRepository personaRepository;
    @PostMapping("/mis-alquileres/resenia")
    public ResponseEntity<?> reseniarEmpleado(@RequestBody ResenaRequest request) {
        try {
            //mati putooooo
            System.out.println(request.toString());
            // Busca las entidades Persona correspondientes
            Persona cliente = personaRepository.findByDni(request.dniCliente)
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            Persona empleado = personaRepository.findByEmail(request.emailEmpleado)
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

            Resena resena = new Resena();
            resena.setCliente(cliente);
            resena.setEmpleado(empleado);
            resena.setComentario(request.comentario);
            resena.setValoracion(request.valoracion);

            Resena resenaGuardada = this.resenaService.saveResenia(resena);
            return ResponseEntity.status(HttpStatus.CREATED).body(resenaGuardada);
        } catch (Exception e) {
            e.printStackTrace(); // Para ver el error real en consola
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocurrió un error al guardar la reseña: " + e.getMessage());
        }
    }
}
