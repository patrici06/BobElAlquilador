package com.BobElAlquilador.demo.model;
//Iteración = {(id(pk): idP(fk), idR(pk)(PK))}

import jakarta.persistence.*;

@Entity
@Table(name = "iteracion")
public class Iteracion {
    @EmbeddedId
    private IteracionId iteracionId;

    @ManyToOne
    @MapsId("id_conversacion")
    @JoinColumn(name = "id_conversacion")
    private Conversacion conversacion;

    @OneToOne
    @MapsId("id_pregunta")
    @JoinColumn(name = "id_pregunta")
    private Pregunta pregunta;

    @OneToOne(optional = true)
    @JoinColumn(name = "id_respuesta", nullable = true)
    private Respuesta respuesta;

    public Iteracion() {
        this.iteracionId = new IteracionId();
    }

    public Iteracion(Conversacion conversacion, Pregunta pregunta, Respuesta respuesta) {
        this.iteracionId = new IteracionId();
        this.conversacion = conversacion;
        this.pregunta = pregunta;
        this.respuesta = respuesta;
        if (conversacion != null) {
            this.iteracionId.setId_conversacion(conversacion.getId_conversacion());
        }
        if (pregunta != null) {
            this.iteracionId.setId_pregunta(pregunta.getIdP());
        }
    }

    public Conversacion getConversacion() {
        return this.conversacion;
    }

    public void setConversacion(Conversacion conversacion) {
        this.conversacion = conversacion;
        if (conversacion != null) {
            this.iteracionId.setId_conversacion(conversacion.getId_conversacion());
        }
    }

    public Respuesta getRespuesta() {
        return this.respuesta;
    }

    public void setRespuesta(Respuesta respuesta) {
        this.respuesta = respuesta;
    }

    public Pregunta getPregunta() {
        return this.pregunta;
    }

    public void setPregunta(Pregunta pregunta) {
        this.pregunta = pregunta;
        if (pregunta != null) {
            this.iteracionId.setId_pregunta(pregunta.getIdP());
        }
    }

    public IteracionId getIteracionId() {
        return iteracionId;
    }

    public void setIteracionId(IteracionId iteracionId) {
        this.iteracionId = iteracionId;
    }
}
