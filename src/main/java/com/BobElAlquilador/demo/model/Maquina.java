package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

//// Maquina = {Nombre(pk), ubicación(fk)?, FechaIngreso?, URL/PATH+Foto, Descripción,
/// nombreEstado(fk), precioxDía, políticaCancelar}
@Entity
@Table (name = "maquina")
public class Maquina {
    @Id
    private String nombre;

    private String ubicacion;
    private LocalDate fechaIngreso;
    @Lob
    private String fotoUrl;
    @Lob
    private String descripcion;

    public Maquina() {}

    public Maquina(String nombre, String ubicacion, LocalDate fechaIngreso, String fotoUrl, String descripcion) {
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.fechaIngreso = fechaIngreso;
        this.fotoUrl = fotoUrl;
        this.descripcion = descripcion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
