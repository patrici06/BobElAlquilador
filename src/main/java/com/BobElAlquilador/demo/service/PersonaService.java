package com.BobElAlquilador.demo.service;
import java.util.*;

import com.BobElAlquilador.demo.model.Alquiler;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Rol;
import com.BobElAlquilador.demo.repository.PersonaRepository;
import com.BobElAlquilador.demo.repository.RolRepository;
import com.BobElAlquilador.demo.util.ClaveGenerador;
import com.BobElAlquilador.demo.util.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PersonaService {
    @Autowired
    CorreoService correoService;
    @Autowired
    PersonaRepository pRepo;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    RolRepository rolRepository;
    @Autowired
    ValidadorCredencialesService validadorCredencialesService;

    public void enviarMailCancelacion(Alquiler aCancelar) {
        correoService.enviarCancelacion(aCancelar.getPersona().getEmail(), aCancelar);
    }

    public void enviarMailCancelacion(List<Alquiler> aCancelar) {
        aCancelar.stream().forEach(alq -> correoService.enviarCancelacion(alq.getPersona().getEmail(), alq));
    }

    public Persona findByDniCliente(String dni) {
        Persona p = pRepo.findById(dni).orElse(null);
        if (p != null && p.getRol().stream().anyMatch(r -> r.equals("ROLE_CLIENTE"))) {
            return p;
        }
        return null;
    }
    public Persona findByDniPropietario(String dni) {
        Persona p = pRepo.findById(dni).orElse(null);
        if (p != null && p.getRol().stream().anyMatch(r -> r.equals("ROLE_PROPIETARIO"))) {
            return p;
        }
        return null;
    }
    public Persona findByDniEmpleado(String dni) {
        Persona p = pRepo.findById(dni).orElse(null);
        if (p != null && p.getRol().stream().anyMatch(r -> r.equals("ROLE_EMPLEADO"))) {
            return p;
        }
        return null;
    }
    public Persona registerNewCliente(RegisterRequest request) {
        validadorCredencialesService.formatoValido(request.getDni(), request.getClave(), request.getEmail());
        Persona persona = new Persona( request.getDni(), request.getNombre(), request.getApellido()
                , request.getEmail(),request.getClave(), request.getTelefono());
        Rol rol = rolRepository.findByNombre("ROLE_CLIENTE")
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        Set<Rol> roles = new HashSet<>();
        roles.add(rol);
        persona.setRoles(roles);
        return this.savePersona(persona);
    }
    public Persona changeUserData(RegisterRequest request) {
        validadorCredencialesService.formatoValido(request.getDni(), request.getClave(), request.getEmail());
        Persona persona = new Persona( request.getDni(), request.getNombre(), request.getApellido()
                , request.getEmail(),request.getClave(), request.getTelefono());
        return this.savePersona(persona);
    }
    public Persona registerNewEmpleado(RegisterRequest request) {
        if (pRepo.existsPersonaByDni(request.getDni())) {
            throw new RuntimeException("El Empleado ya existe");
        }
        if (pRepo.existsPersonaByEmail(request.getEmail())) {
            throw new RuntimeException("El Mail ya esta en uso porfavor contactar al propietario");
        }
        Persona persona = new Persona( request.getDni(), request.getNombre(), request.getApellido()
                , request.getEmail(),ClaveGenerador.generar(12));

        String clave = persona.getClave();
        //Requiere Ser enviada por mail Guardado temporal!
        Rol rol = rolRepository.findByNombre("ROLE_EMPLEADO")
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        Set<Rol> roles = new HashSet<>();
        roles.add(rol);
        persona.setRoles(roles);
        return this.savePersona(persona);
    }

    private Persona savePersona(Persona persona) {
        persona.setClave(passwordEncoder.encode(persona.getClave()));
        return this.pRepo.save(persona);
    }
    private void updatePersona(Persona persona) {
        this.pRepo.save(persona);
    }
    public boolean deletePersona(Persona persona) { this.pRepo.delete(persona); return true; }
}
