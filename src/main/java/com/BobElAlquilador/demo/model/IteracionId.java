package com.BobElAlquilador.demo.model;
////Iteración = {(idC(pk): idP(fk), idR(pk)(PK))}
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class IteracionId implements Serializable {
    private Long id_conversacion;
    private Long id_pregunta;
    private Long id_respuesta;
    public IteracionId(){}

    public IteracionId(Long id_conversacion, Long id_pregunta, Long id_respuesta) {
        this.id_conversacion = id_conversacion;
        this.id_pregunta = id_pregunta;
        this.id_respuesta = id_respuesta;
    }
    public Long getId_conversacion() {
        return id_conversacion;
    }

    public void setId_conversacion(Long id_conversacion) {
        this.id_conversacion = id_conversacion;
    }

    public Long getId_pregunta() {
        return id_pregunta;
    }

    public void setId_pregunta(Long id_pregunta) {
        this.id_pregunta = id_pregunta;
    }

    public Long getId_respuesta() {
        return id_respuesta;
    }

    public void setId_respuesta(Long id_respuesta) {
        this.id_respuesta = id_respuesta;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        IteracionId that = (IteracionId) o;
        return Objects.equals(id_conversacion, that.id_conversacion) && Objects.equals(id_pregunta, that.id_pregunta) && Objects.equals(id_respuesta, that.id_respuesta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id_conversacion, id_pregunta, id_respuesta);
    }
}
