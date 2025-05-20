package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

//// Maquina = {Nombre(pk), ubicación(fk)?, FechaIngreso?, URL/PATH+Foto, Descripción,
/// nombreEstado(fk), precioxDía, políticaCancelar}
@Entity
@Table (name = "maquina")
public class Maquina extends DbEstado{
    @Id
    private String nombre_maquina;

    private String ubicacion;
    private LocalDate fecha_ingreso;
    @Lob
    private String fotoUrl;
    @Lob
    private String descripcion;
    private String tipo;
    private EstadoMaquina estadoMaquina;
    private double precio_dia;
    public Maquina() {
        super();
    }

    public Maquina(String nombre, String ubicacion, LocalDate fecha, String fotoUrl, String descripcion, String tipo, double precio) {
        this.nombre_maquina = nombre;
        this.ubicacion = ubicacion;
        this.fecha_ingreso = fecha;
        this.fotoUrl = fotoUrl;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.precio_dia = precio;
        this.estadoMaquina = EstadoMaquina.Disponible;
    }
    public EstadoMaquina getEstadoMaquina (){
        return this.estadoMaquina;
    }
    public void setEstadoMaquina(EstadoMaquina estadoMaquina){
        this.estadoMaquina =  estadoMaquina;
    }
    public void setEstadoMaquinaDisponible(){ this.estadoMaquina = EstadoMaquina.Disponible;}
    public void setEstadoMaquinaMantenimiento(){ this.estadoMaquina = EstadoMaquina.Mantenimiento;}
    public void setEstadoMaquinaDescompuesta(){this.estadoMaquina = EstadoMaquina.Descompuesta;}
    public String getTipo(){ return tipo; }

    public void setTipo(String tipo){
        this.tipo = tipo;
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

    public double calcularPrecio(long cantDias) {
        return this.precio_dia * cantDias;
    }
}
