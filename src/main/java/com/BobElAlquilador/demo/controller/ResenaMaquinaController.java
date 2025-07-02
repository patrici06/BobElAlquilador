package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.ResenaMaquina;
import com.BobElAlquilador.demo.service.MaquinaService;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.service.ResenaMaquinaService;
import com.BobElAlquilador.demo.util.ResenaMaquinaRequest;
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
    @Autowired
    private MaquinaService maquinaService;
    @Autowired
    private PersonaService personaService;
    @PostMapping("/crearResenia/{email}-{nombreMaquina}")
    public ResponseEntity<?> crearResenia(@PathVariable String email,@PathVariable String nombreMaquina,
                                          @RequestBody ResenaMaquinaRequest resenaMaquina){
        try{
            Maquina maquina = maquinaService.getMaquinaPorNombre(nombreMaquina);
            if (maquina == null) throw new RuntimeException("No existe la máquina indicada: " + nombreMaquina);

            Persona cliente = personaService.findByEmail(email);
            if (cliente == null) throw new RuntimeException("No existe el usuario indicado: " + email);

            if (resenaMaquinaService.yaComentoMaquina(email, nombreMaquina)){
                throw new RuntimeException("Ya hizo una reseña sobre esta maquina");
            }
            ResenaMaquina resena = new ResenaMaquina(maquina, cliente,resenaMaquina.getComentario(),
                    resenaMaquina.getValoracion());
            this.resenaMaquinaService.save(resena);
            return ResponseEntity.status(HttpStatus.CREATED).body("Su reseña fue publicada");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/search")
    public ResponseEntity<?> getResenaMaquina(@RequestParam String nombreMaquina)
    {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(
                    this.resenaMaquinaService.findAllByNombreMaquina(nombreMaquina)
            );
        }
        catch (Exception e ){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMaquina(@PathVariable long id) {
        try {
            ResenaMaquina res = resenaMaquinaService.getResenaMaquinaPorId(id);
            resenaMaquinaService.eliminarResenaMaquina(res);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Reseña eliminada correctamente, puede dejar una nueva si desea");
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al eliminar la reseña de maquina: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
