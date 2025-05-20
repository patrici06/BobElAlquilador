package com.BobElAlquilador.demo.segurity;

import com.BobElAlquilador.demo.model.Persona;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {
    private final Persona persona;
    public CustomUserDetails(Persona persona) { this.persona = persona; }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return persona.getRol().stream()
                .map(rol -> new SimpleGrantedAuthority(rol.getNombre()))
                .collect(Collectors.toList());
    }
    @Override
    public String getPassword() { return persona.getClave(); }
    @Override
    public String getUsername() { return persona.getDni(); }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}