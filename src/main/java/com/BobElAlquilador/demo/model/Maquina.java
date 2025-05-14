package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

//// Maquina = {Nombre(pk), ubicación(fk)?, FechaIngreso?, URL/PATH+Foto, Descripción,
/// nombreEstado(fk), precioxDía, políticaCancelar}
@Entity
@Table (name = "maquina")
public class Maquina {
    @Id
    private String nombre_maquina;

    private String ubicacion;
    private LocalDate fecha_ingreso;
    @Lob
    private String fotoUrl;
    @Lob
    private String descripcion;

    public Maquina() {}

    public Maquina(String nombre, String ubicacion, LocalDate fechaIngreso, String fotoUrl, String descripcion) {
        this.nombre_maquina = nombre;
        this.ubicacion = ubicacion;
        this.fecha_ingreso = fechaIngreso;
        this.fotoUrl = fotoUrl;
        this.descripcion = descripcion;
    }

    public String getNombre() {
        return nombre_maquina;
    }

    public void setNombre(String nombre) {
        this.nombre_maquina = nombre;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public LocalDate getFechaIngreso() {
        return fecha_ingreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fecha_ingreso = fechaIngreso;
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
