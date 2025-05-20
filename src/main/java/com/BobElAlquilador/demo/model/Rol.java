package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

@Entity
public class Rol {
    @Id
    private String nombre;
    public Rol(){
    }
    public String getNombre() {return this.nombre;}
    public Rol(String nombre){
        this.nombre = nombre.toUpperCase();
    }
}