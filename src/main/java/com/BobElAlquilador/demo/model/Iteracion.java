package com.BobElAlquilador.demo.model;
//Iteración = {(id(pk): idP(fk), idR(pk)(PK))}

import jakarta.persistence.*;

@Entity
@Table (name = "iteracion")
public class Iteracion {
    @EmbeddedId
    private IteracionId iteracionId;

    @ManyToOne
    @MapsId ("id_conversacion")
    @JoinColumn (name = "id_conversacion")
    private Conversacion conversacion;
    @OneToOne
    @MapsId ("id_pregunta")
    @JoinColumn(name = "id_pregunta")
    private Pregunta pregunta;
    @OneToOne
    @MapsId ("id_respuesta")
    @JoinColumn(name  =  "id_respuesta")
    private Respuesta respuesta;




}
