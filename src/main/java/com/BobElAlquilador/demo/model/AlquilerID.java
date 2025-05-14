package com.BobElAlquilador.demo.model;
//Alquiler = {(NombreMaquina(fk), FechaInicio, FechaFin)(PK), DNI(C)(fk)}
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Embeddable
public class AlquilerID  implements Serializable {
    private String nombre_maquina;
    private LocalDate fecha_inicio;
    private LocalDate fecha_fin;

    public AlquilerID(){}
    public AlquilerID(String nombre_maquina, LocalDate fecha_inicio, LocalDate fecha_fin) {
        this.nombre_maquina = nombre_maquina;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
    }

    public String getNombre_maquina() {
        return nombre_maquina;
    }

    public void setNombre_maquina(String nombre_maquina) {
        this.nombre_maquina = nombre_maquina;
    }

    public LocalDate getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(LocalDate fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public LocalDate getFecha_fin() {
        return fecha_fin;
    }

    public void setFecha_fin(LocalDate fecha_fin) {
        this.fecha_fin = fecha_fin;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        AlquilerID that = (AlquilerID) o;
        return Objects.equals(nombre_maquina, that.nombre_maquina) && Objects.equals(fecha_inicio, that.fecha_inicio) && Objects.equals(fecha_fin, that.fecha_fin);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre_maquina, fecha_inicio, fecha_fin);
    }
}
