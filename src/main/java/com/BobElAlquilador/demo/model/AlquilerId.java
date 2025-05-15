package com.BobElAlquilador.demo.model;
//Alquiler = {(NombreMaquina(fk), FechaInicio, FechaFin)(PK), DNI(C)(fk)}
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Embeddable
public class AlquilerId implements Serializable {
    private String nombre_maquina;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    public AlquilerId() {}

    public AlquilerId(String nombre_maquina, LocalDate fechaInicio, LocalDate fechaFin) {
        this.nombre_maquina = nombre_maquina;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    public String getNombre_maquina() {
        return nombre_maquina;
    }

    public void setNombre_maquina(String nombre_maquina) {
        this.nombre_maquina = nombre_maquina;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AlquilerId that = (AlquilerId) o;
        return Objects.equals(nombre_maquina, that.nombre_maquina) &&
                Objects.equals(fechaInicio, that.fechaInicio) &&
                Objects.equals(fechaFin, that.fechaFin);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre_maquina, fechaInicio, fechaFin);
    }
}
