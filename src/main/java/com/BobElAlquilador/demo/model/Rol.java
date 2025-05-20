package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

@Entity
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    public Rol(){
    }
    public String getNombre() {return this.nombre;}
    public Rol(String nombre){
        this.nombre = nombre.toUpperCase();
    }
}