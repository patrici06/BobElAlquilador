package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rol")
public class Rol {
    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String nombre;
    public Rol(){
    }
    public String getNombre() {return this.nombre.toUpperCase();}
    public Rol(String nombre){
        this.nombre = nombre.toUpperCase();
    }

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
}