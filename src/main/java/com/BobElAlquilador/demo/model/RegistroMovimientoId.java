package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

//Registro Movimiento = {ubicación(fk), NombreMaquina(fk), FechaIngreso(PK), FechaEgreso}

@Embeddable
public class RegistroMovimientoId implements Serializable {
    private String nombre_maquina;
    private String ubicacion;
    private LocalDate fechaIngreso;

    public RegistroMovimientoId() {}

    public RegistroMovimientoId(String nombreMaquina, String ubicacion, LocalDate fechaIngreso) {
        this.nombre_maquina = nombreMaquina;
        this.ubicacion = ubicacion;
        this.fechaIngreso = fechaIngreso;
    }

    public String getNombreMaquina() {
        return nombre_maquina;
    }

    public void setNombreMaquina(String nombreMaquina) {
        this.nombre_maquina = nombreMaquina;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        RegistroMovimientoId that = (RegistroMovimientoId) o;
        return Objects.equals(nombre_maquina, that.nombre_maquina) && Objects.equals(ubicacion, that.ubicacion) && Objects.equals(fechaIngreso, that.fechaIngreso);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre_maquina, ubicacion, fechaIngreso);
    }
}
