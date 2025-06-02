package com.BobElAlquilador.demo.model;
//Alquiler = {(NombreMaquina(fk), FechaInicio, FechaFin)(PK), DNI(C)(fk)}

import jakarta.persistence.*;

@Entity
@Table(name = "alquiler")
public class Alquiler extends DbEstado {
    @EmbeddedId
    private AlquilerId alquilerId;

    @ManyToOne
    @MapsId("nombre_maquina")
    @JoinColumn(name = "nombre_maquina")
    private Maquina maquina;

    @ManyToOne
    @JoinColumn(name = "persona_dni")
    private Persona cliente;

    private Double precioTotal;

    @Enumerated(EnumType.STRING)
    private EstadoAlquiler estado;

    public Alquiler() {
        super();
    }

    public Alquiler(AlquilerId alquilerId, Maquina maquina, Persona cliente, Double precioTotal) {
        super();
        this.alquilerId = alquilerId;
        this.maquina = maquina;
        this.cliente = cliente;
        this.estado = EstadoAlquiler.Pendiente;
        this.precioTotal = precioTotal;
    }

    public void cancelamientoInvoluntario() {
        this.estado = EstadoAlquiler.CanceladoInvoluntario;
    }

    public Double getPrecioTotal() {
        return precioTotal;
    }

    public void setPrecioTotal(Double precioTotal) {
        this.precioTotal = precioTotal;
    }

    public AlquilerId getAlquilerId() {
        return alquilerId;
    }

    public void setAlquilerId(AlquilerId alquilerId) {
        this.alquilerId = alquilerId;
    }

    public Maquina getMaquina() {
        return maquina;
    }

    public void setMaquina(Maquina maquina) {
        this.maquina = maquina;
    }

    public Persona getPersona() {
        return cliente;
    }

    public void setPersona(Persona cliente) {
        this.cliente = cliente;
    }

    public EstadoAlquiler getEstadoAlquiler() {
        return estado;
    }

    public void setEstado(EstadoAlquiler estado) {
        this.estado = estado;
    }
}