package com.BobElAlquilador.demo.model;
import jakarta.persistence.*;

//Cliente = (DNI(pk), nombre, apellido, email, clave, Teléfono?)
@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    private String dni_cliente;

    private String nombre;
    private String apellido;
    private String email;
    private String clave;
    private String telefono;
    public Cliente(){}

    public Cliente(String dni, String nombre, String apellido, String email, String clave, String telefono) {
        this.dni_cliente = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.clave = clave;
        this.telefono = telefono;
    }

    public String getDni() {
        return dni_cliente;
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
