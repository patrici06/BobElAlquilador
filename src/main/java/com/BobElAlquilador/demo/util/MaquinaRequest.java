package com.BobElAlquilador.demo.util;

import com.BobElAlquilador.demo.model.EstadoMaquina;

import java.time.LocalDate;

public class MaquinaRequest {

    private String nombreMaquina;
    private String ubicacion;
    private LocalDate fechaIngreso;
    private String fotoUrl;
    private String descripcion;
    private String tipo;
    private EstadoMaquina estadoMaquina;
    private double precioDia;

    // Getter y Setter para nombreMaquina
    public String getNombreMaquina() {
        return nombreMaquina;
    }

    public void setNombreMaquina(String nombreMaquina) {
        this.nombreMaquina = nombreMaquina;
    }

    // Getter y Setter para ubicacion
    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    // Getter y Setter para fechaIngreso
    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    // Getter y Setter para fotoUrl
    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    // Getter y Setter para descripcion
    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // Getter y Setter para tipo
    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    // Getter y Setter para estadoMaquina
    public EstadoMaquina getEstadoMaquina() {
        return estadoMaquina;
    }

    public void setEstadoMaquina(EstadoMaquina estadoMaquina) {
        this.estadoMaquina = estadoMaquina;
    }

    // Getter y Setter para precioDia
    public double getPrecioDia() {
        return precioDia;
    }

    public void setPrecioDia(double precioDia) {
        this.precioDia = precioDia;
    }
}