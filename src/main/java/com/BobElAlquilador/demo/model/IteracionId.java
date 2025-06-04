package com.BobElAlquilador.demo.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class IteracionId implements Serializable {
    private Long id_conversacion;
    private Long id_pregunta;

    public IteracionId() {}

    public IteracionId(Long id_conversacion, Long id_pregunta) {
        this.id_conversacion = id_conversacion;
        this.id_pregunta = id_pregunta;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IteracionId that = (IteracionId) o;
        return Objects.equals(id_conversacion, that.id_conversacion) &&
               Objects.equals(id_pregunta, that.id_pregunta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id_conversacion, id_pregunta);
    }
} 