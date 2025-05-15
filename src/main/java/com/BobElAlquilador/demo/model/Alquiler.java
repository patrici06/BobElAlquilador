package com.BobElAlquilador.demo.model;
//Alquiler = {(NombreMaquina(fk), FechaInicio, FechaFin)(PK), DNI(C)(fk)}

import jakarta.persistence.*;

@Entity
@Table(name = "alquiler")
public class Alquiler {
    @EmbeddedId
    private AlquilerId alquilerId;

    @ManyToOne
    @MapsId("nombre_maquina")
    @JoinColumn(name = "nombre_maquina")
    private Maquina maquina;

    @ManyToOne
    @JoinColumn(name = "dni_cliente")
    private Cliente cliente;

    private Boolean estado;

    public Alquiler() {}

    public Alquiler(AlquilerId alquilerId, Maquina maquina, Cliente cliente, Boolean estado) {
        this.alquilerId = alquilerId;
        this.maquina = maquina;
        this.cliente = cliente;
        this.estado = estado;
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

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}