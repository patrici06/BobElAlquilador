package com.BobElAlquilador.demo.model;
import jakarta.persistence.*;
//Dueño/propietario = (DNI(pk), nombre, apellido, email, clave)
@Entity
@Table(name = "propietario")
public class Propietario extends Persona {
    public Propietario(){
        super();
    }

    public Propietario(String dni, String nombre, String apellido, String email, String clave) {
       super(dni, nombre,apellido,email,clave);
    }

}