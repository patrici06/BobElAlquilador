package com.BobElAlquilador.demo.model;
////Iteración = {(idC(pk): idP(fk), idR(pk)(PK))}
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class IteracionId implements Serializable {
    private Long idConversacion;
    private Long idPregunta;
    private Long idRespuesta;
    public IteracionId(){}

    public IteracionId(Long id_conversacion, Long id_pregunta, Long id_respuesta) {
        this.idConversacion = id_conversacion;
        this.idPregunta = id_pregunta;
        this.idRespuesta = id_respuesta;
    }
    public Long getId_conversacion() {
        return idConversacion;
    }

    public void setId_conversacion(Long id_conversacion) {
        this.idConversacion = id_conversacion;
    }

    public Long getId_pregunta() {
        return idPregunta;
    }

    public void setId_pregunta(Long id_pregunta) {
        this.idPregunta = id_pregunta;
    }

    public Long getId_respuesta() {
        return idRespuesta;
    }

    public void setId_respuesta(Long id_respuesta) {
        this.idRespuesta = id_respuesta;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        IteracionId that = (IteracionId) o;
        return Objects.equals(idConversacion, that.idConversacion) && Objects.equals(idPregunta, that.idPregunta) && Objects.equals(idRespuesta, that.idRespuesta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idConversacion, idPregunta, idRespuesta);
    }
}
