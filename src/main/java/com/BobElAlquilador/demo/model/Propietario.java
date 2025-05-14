package com.BobElAlquilador.demo.model;
import jakarta.persistence.*;
//Dueño/propietario = (DNI(pk), nombre, apellido, email, clave)
@Entity
@Table(name = "propietario")
public class Propietario {
    @Id
    private String dni_propietario;

    private String nombre;
    private String apellido;
    private String email;
    private String clave;
    public Propietario(){}

    public Propietario(String dni, String nombre, String apellido, String email, String clave) {
        this.dni_propietario = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.clave = clave;
    }

    public String getDni() {
        return dni_propietario;
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