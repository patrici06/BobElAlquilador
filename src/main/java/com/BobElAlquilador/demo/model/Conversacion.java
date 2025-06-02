package com.BobElAlquilador.demo.model;

//Conversación = {id(pk)}

import jakarta.persistence.*;

@Entity
@Table (name = "conversacion")
public class Conversacion extends DbEstado {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long idConversacion;
    public Conversacion(){
        super();
    }

    public Conversacion(Long id_conversacion) {
        super();
        this.idConversacion = id_conversacion;
    }

    public Long getId_conversacion() {
        return idConversacion;
    }

    public void setId_conversacion(Long id_conversacion) {
        this.idConversacion = id_conversacion;
    }
}
