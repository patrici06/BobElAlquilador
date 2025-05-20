package com.BobElAlquilador.demo.model;
import jakarta.persistence.*;


import java.util.HashSet;
import java.util.Set;
@Entity
@Table (name  =  "persona")
public class Persona extends DbEstado {
    @Id
    private String dni;

    private String nombre;
    private String apellido;
    private String email;
    private String clave;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "persona_roles",
            joinColumns = @JoinColumn(name = "persona_dni"),
            inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private Set<Rol> roles;
    public Persona(){}
    public Persona(String dni, String nombre, String apellido, String email, String clave) {
        super();
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.clave = clave;
    }
    public Set<Rol>getRol(){
        return this.roles;
    }
    public void setRol(String rol){
        this.roles = new HashSet<Rol>();
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
}
