package com.BobElAlquilador.demo.service;
import java.util.*;

import com.BobElAlquilador.demo.model.Alquiler;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Rol;
import com.BobElAlquilador.demo.repository.PersonaRepository;
import com.BobElAlquilador.demo.repository.ResenaRepository;
import com.BobElAlquilador.demo.repository.RolRepository;
import com.BobElAlquilador.demo.util.ClaveGenerador;
import com.BobElAlquilador.demo.util.EmpleadoValoracionDTO;
import com.BobElAlquilador.demo.util.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PersonaService {
    @Autowired
    CorreoService correoService;
    @Autowired
    ResenaRepository resenaRepository;
    @Autowired
    PersonaRepository pRepo;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    RolRepository rolRepository;
    @Autowired
    ValidadorCredencialesService validadorCredencialesService;

    public List<EmpleadoValoracionDTO> EmpleadosOrderByValoracion(){
        return resenaRepository.findAllEmpleadosWithPromedioValoracionDesc();
    }

    public void enviarMailCancelacion(Alquiler aCancelar) {
        correoService.enviarCancelacion(aCancelar.getPersona().getEmail(), aCancelar);
    }

    public void enviarMailCancelacion(List<Alquiler> aCancelar) {
        aCancelar.stream().forEach(alq -> correoService.enviarCancelacion(alq.getPersona().getEmail(), alq));
    }

    public Persona findByDniCliente(String dni) {
        Persona p = pRepo.findByDni(dni).orElse(null);
        if (p != null && p.getRol().stream()
                                    .anyMatch(r -> "ROLE_CLIENTE".equals(r.getNombre()))) {
            return p;
        }
        return null;
    }
    public Persona findByDniPropietario(String dni) {
        Persona p = pRepo.findByDni(dni).orElse(null);
        if (p != null && p.getRol().stream().anyMatch(r -> r.equals("ROLE_PROPIETARIO"))) {
            return p;
        }
        return null;
    }
    public Persona findByDniEmpleado(String dni) {
        Persona p = pRepo.findByDni(dni).orElse(null);
        if (p != null && p.getRol().stream().anyMatch(r -> r.equals("ROLE_EMPLEADO"))) {
            return p;
        }
        return null;
    }
    public Persona findByEmail(String email){
        return this.pRepo.findById(email).orElse(null);
    }
    public Persona registerNewCliente(RegisterRequest request) {
        validadorCredencialesService.formatoValido(request.getDni(), request.getClave(), request.getEmail(), request.getFechaNacimiento());
        Persona persona = new Persona( request.getDni(), request.getNombre(), request.getApellido()
                , request.getEmail(),request.getClave(), request.getTelefono(),request.getFechaNacimiento());
        Rol rol = rolRepository.findByNombre("ROLE_CLIENTE")
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        Set<Rol> roles = new HashSet<>();
        roles.add(rol);
        persona.setRoles(roles);
        return this.savePersona(persona);
    }
    public Persona changeUserData(RegisterRequest request) {
        Persona persona = pRepo.findById(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (    request.getClaveAnterior() == null ||
                request.getClaveAnterior().isEmpty() ||
                !passwordEncoder.matches(request.getClaveAnterior(), persona.getClave())) {
            throw new RuntimeException("La clave original es erronea");
        }
        if (     request.getClave() != null &&
                !request.getClave().isEmpty() &&
                validadorCredencialesService.formatoClaveValido(request.getClave()))
        {
            persona.setClave(passwordEncoder.encode(request.getClave()));
        }
        persona.setNombre(request.getNombre());
        persona.setApellido(request.getApellido());
        persona.setTelefono(request.getTelefono());
        return this.pRepo.save(persona);
    }
    public Persona registerNewEmpleado(RegisterRequest request) {
        if (pRepo.existsPersonaByDni(request.getDni())) {
            throw new RuntimeException("El Empleado ya existe");
        }
        if (pRepo.existsPersonaByEmail(request.getEmail())) {
            throw new RuntimeException("El mail ya esta en uso, por favor contactar al propietario");
        }
        Persona persona = new Persona( request.getDni(), request.getNombre(), request.getApellido()
                , request.getEmail(),ClaveGenerador.generar(12));
        persona.setFechaNacimiento(request.getFechaNacimiento()); // <-- PRIMERO AQUÍ
        validadorCredencialesService.usuarioMenorDeEdad(persona.getFechaNacimiento()); // <-- LUEGO AQUÍ
        String clave = persona.getClave();
       correoService.enviarMail(request.getEmail(), "Clave Auto-Generada",
               "Tu Clave auto generada para el primer login es:\n" +
                       clave +"\n"+
                       "Cambiala Una vez inicies tu sesión con tu correo y la clave provista. Saludos!"
               );
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
    public boolean deletePersona(Persona persona) { this.pRepo.delete(persona); return true; }
}
