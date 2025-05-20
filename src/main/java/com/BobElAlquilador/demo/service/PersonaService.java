package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PersonaService {
    @Autowired
    PersonaRepository pRepo;
    @Autowired
    PasswordEncoder passwordEncoder;

    public Persona findByDniCliente(String dni) {
        Persona p = pRepo.findById(dni).orElse(null);
        if (p != null && p.getRol().stream().anyMatch(r -> r.equals("CLIENTE"))) {
            return p;
        }
        return null;
    }
    public Persona findByDniPropietario(String dni) {
        Persona p = pRepo.findById(dni).orElse(null);
        if (p != null && p.getRol().stream().anyMatch(r -> r.equals("PROPIETARIO"))) {
            return p;
        }
        return null;
    }
    public Persona findByDniEmpleado(String dni) {
        Persona p = pRepo.findById(dni).orElse(null);
        if (p != null && p.getRol().stream().anyMatch(r -> r.equals("EMPLEADO"))) {
            return p;
        }
        return null;
    }
    public Persona registerNewUser(RegisterRequest request) {
        if (personaRepository.existsById(request.getDni())) {
            throw new RuntimeException("El usuario ya existe");
        }

        Persona persona = new Persona( request);
        persona.setDni(request.getDni());
        persona.setNombre(request.getNombre());
        persona.setApellido(request.getApellido());
        persona.setEmail(request.getEmail());
        persona.setClave(passwordEncoder.encode(request.getClave()));

        Set<Rol> roles = new HashSet<>();
        for (String nombreRol : request.getRoles()) {
            Rol rol = rolRepository.findByNombre(nombreRol)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + nombreRol));
            roles.add(rol);
        }
        persona.setRoles(roles);

        return personaRepository.save(persona);
    }


    public void savePersona(Persona persona) {
        persona.setClave(passwordEncoder.encode(persona.getClave()));
        this.pRepo.save(persona);
    }
    public void updatePersona(Persona persona) {
        this.pRepo.save(persona);
    }
    public boolean deletePersona(Persona persona) { this.pRepo.delete(persona); return true; }
}
