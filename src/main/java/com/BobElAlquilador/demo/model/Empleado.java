package com.BobElAlquilador.demo.model;
//Empleado = (DNI(pk), nombre, apellido, email, clave)
import jakarta.persistence.*;

@Entity
@Table (name = "empleado")
public class Empleado {
    @Id
    private String dni_empleado;

    private String nombre;
    private String apellido;
    private String email;
    private String clave;
    public Empleado(){}

    public Empleado(String dni, String nombre, String apellido, String email, String clave) {
        this.dni_empleado = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.clave = clave;
    }
    public String getDni(){
        return this.dni_empleado;
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
