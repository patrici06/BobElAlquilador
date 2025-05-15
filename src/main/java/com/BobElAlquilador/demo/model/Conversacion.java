package com.BobElAlquilador.demo.model;

//Conversación = {id(pk)}

import jakarta.persistence.*;

@Entity
@Table (name = "conversacion")
public class Conversacion extends DbEstado {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id_conversacion;
    public Conversacion(){
        super();
    }

    public Conversacion(Long id_conversacion) {
        super();
        this.id_conversacion = id_conversacion;
    }

    public Long getId_conversacion() {
        return id_conversacion;
    }

    public void setId_conversacion(Long id_conversacion) {
        this.id_conversacion = id_conversacion;
    }
}
