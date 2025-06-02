package com.BobElAlquilador.demo.model;
//Iteración = {(id(pk): idP(fk), idR(pk)(PK))}

import jakarta.persistence.*;

@Entity
@Table (name = "iteracion")
public class Iteracion {
    @EmbeddedId
    private IteracionId iteracionId;
   
    @ManyToOne
    @MapsId ("idConversacion")
    @JoinColumn (name = "id_conversacion")
    private Conversacion conversacion;
    @OneToOne
    @MapsId ("idPregunta")
    @JoinColumn(name = "id_pregunta")
    private Pregunta pregunta;
    @OneToOne
    @MapsId ("idRespuesta")
    @JoinColumn(name  =  "id_respuesta")
    private Respuesta respuesta;

    public Iteracion() {}    
    
    public Iteracion(Conversacion conversacion, Pregunta pregunta, Respuesta respuesta) {
        this.conversacion = conversacion; 
        this.pregunta =  pregunta; 
        this.respuesta = respuesta;
    }
    
    public Conversacion getConversacion(){
        return this.conversacion;
    }
    public void setConversacion(Conversacion conversacion){
        this.conversacion = conversacion;
    }
    public Respuesta getRespuesta(){
        return this.respuesta;
    } 
    public void setRespuesta(Respuesta respuesta){
        this.respuesta  = respuesta;
    }
    public Pregunta getPregunta() {
        return this.pregunta;
    }
    public void setPregunta(Pregunta pregunta) {
        this.pregunta = pregunta;
    }
}
