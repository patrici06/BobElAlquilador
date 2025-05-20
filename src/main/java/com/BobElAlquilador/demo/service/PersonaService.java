package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonaService {
    @Autowired
    PersonaRepository pRepo;
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
    public void savePersona(Persona persona) { this.pRepo.save(persona); }
    public boolean deletePersona(Persona persona) { this.pRepo.delete(persona); return true; }
}
