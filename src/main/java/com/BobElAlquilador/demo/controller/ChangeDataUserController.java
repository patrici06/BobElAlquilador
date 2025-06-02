package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.service.PersonaService;
import com.BobElAlquilador.demo.util.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/perfil")
public class ChangeDataUserController {

    @Autowired
    private PersonaService personaService;

    // GET /usuario/{dni}
    @GetMapping("/{email}")
    public ResponseEntity<?> getUsuarioPorEmail(@PathVariable String email) {
        Persona usuario = personaService.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setClave("");
        return ResponseEntity.ok(usuario);
    }
    @PostMapping("/{email}")
    public ResponseEntity<?> actualizarCampos(@RequestBody RegisterRequest registerRequest, @PathVariable String email) {
        // Puedes usar el email del path o del body, pero debería coincidir
        try {
            // Si quieres, puedes validar que registerRequest.getEmail().equals(email)

            Persona usuario = personaService.changeUserData(registerRequest);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al actualizar usuario:" + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}