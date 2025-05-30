package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Value;

import java.io.Serializable;
@Entity
@Table(name = "tipo")
public class Tipo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true)
    private String nombre;
    public Tipo (){

    }
    public Tipo(String nombreTipo) {
        this.nombre = nombreTipo;
    }
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombreTipo() {
        return nombre;
    }

    public void setNombreTipo(String nombreTipo) {
        this.nombre = nombreTipo;
    }

    @Override
    public String toString() {
        return nombre;
    }
}
