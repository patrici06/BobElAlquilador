package com.BobElAlquilador.demo.model;
import jakarta.persistence.*;
import org.springframework.beans.PropertyValues;


import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
@Entity
@Table (name  =  "persona")
public class Persona extends DbEstado {
    @Id
    private String email;
    private String dni;
    private String nombre;
    private String apellido;
    private String clave;
    private String telefono;
    private LocalDate fechaNacimiento;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "persona_roles",
            joinColumns = @JoinColumn(name = "persona_email", referencedColumnName = "email"),
            inverseJoinColumns = @JoinColumn(name = "rol_id", referencedColumnName = "id")
    )
    private Set<Rol> roles;
    public Persona(){super();}
    public Persona(String dni, String nombre, String apellido, String email, String clave) {
        super();
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.clave = clave;
        this.roles = new HashSet<>();
        this.fechaNacimiento = fechaNacimiento;
    }
    public Persona(String dni, String nombre, String apellido, String email, String clave, String telefono, LocalDate fechaNacimiento) {
        super();
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.clave = clave;
        this.telefono = telefono;
        this.roles = new HashSet<Rol>();
        this.fechaNacimiento = fechaNacimiento;
    }
    public Set<Rol> getRol() {
        return this.roles;
    }// PATO CAMBIE ESTO PORQ ESTABA EN EMAIL Y EN LA BD ES EL DNI LA PK
    public LocalDate getFechaNacimiento(){return this.fechaNacimiento;}
    public void setFechaNacimiento(LocalDate fechaNacimiento){ this.fechaNacimiento = fechaNacimiento;}
    public void addRol(Rol rol) {
        this.roles.add(rol);
    }
    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }
    public String getDni() {
        return dni;
    }
    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
