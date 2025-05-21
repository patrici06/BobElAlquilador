package com.BobElAlquilador.demo.service;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.repository.PersonaRepository;
import com.BobElAlquilador.demo.segurity.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private PersonaRepository personaRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Persona persona = personaRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Credenciales Invalidas Email o Clave Incorrectos"));
        return new CustomUserDetails(persona);
    }

    public Persona getPersonaByDni(String dni) {
        return this.personaRepository.findById(dni).orElse(null);
     }
}