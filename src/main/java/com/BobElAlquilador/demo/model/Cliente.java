package com.BobElAlquilador.demo.model;
import jakarta.persistence.*;

//Cliente = (DNI(pk), nombre, apellido, email, clave, Teléfono?)
@Entity
@Table(name = "cliente")
public class Cliente extends Persona{
    private String telefono;
    public Cliente(){
        super();
    }

    public Cliente(String dni, String nombre, String apellido, String email, String clave, String telefono) {
        super(dni, nombre, apellido, email, clave);
        this.telefono = telefono;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
