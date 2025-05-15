package com.BobElAlquilador.demo.model;
//Empleado = (DNI(pk), nombre, apellido, email, clave)
import jakarta.persistence.*;

@Entity
@Table (name = "empleado")
public class Empleado extends Persona{
    public Empleado(){}

    public Empleado(String dni, String nombre, String apellido, String email, String clave) {
        super(dni, nombre, apellido, email, clave);
    }
}
