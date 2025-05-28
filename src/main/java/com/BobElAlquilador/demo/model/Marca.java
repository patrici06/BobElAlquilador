package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marca")
public class Marca extends DbEstado{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column (unique = true)
    private String nombre;

    public Marca(){}

    public Marca (String nombre) {
        this.nombre = nombre;
    }

    public int getId() {
        return(this.id);
    }

    public String getNombre() {
        return(this.nombre);
    }
}
