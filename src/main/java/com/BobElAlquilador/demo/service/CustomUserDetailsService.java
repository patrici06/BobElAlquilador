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
    private PersonaRepository PersonaRepository;
    @Override
    public UserDetails loadUserByUsername(String dni) throws UsernameNotFoundException {
        Persona Persona = PersonaRepository.findById(dni)
                .orElseThrow(() -> new UsernameNotFoundException("Persona no encontrado"));
        return new CustomUserDetails(Persona);
    }
}