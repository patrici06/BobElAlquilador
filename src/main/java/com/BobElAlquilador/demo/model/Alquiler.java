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
    @JoinColumn(name = "dni_cliente")
    private Cliente cliente;

    private Double precioTotal;
    private EstadoAlquiler estado;

    public Alquiler() {
        super();
    }

    public Alquiler(AlquilerId alquilerId, Maquina maquina, Cliente cliente, Double precioTotal) {
        super();
        this.alquilerId = alquilerId;
        this.maquina = maquina;
        this.cliente = cliente;
        this.estado = EstadoAlquiler.Pendiente;
        this.precioTotal = precioTotal;
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

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public EstadoAlquiler getEstadoAlquiler() {
        return estado;
    }

    public void setEstadoActivo() {
        this.estado = EstadoAlquiler.Activo;
    }

    public void setEstadoPendiente() {
        this.estado = EstadoAlquiler.Pendiente;
    }

    public void setEstadoCancelado() {
        this.estado = EstadoAlquiler.Cancelado;
    }
    public void serEstadoFinalizado(){ this.estado = EstadoAlquiler.Finalizado; }
}