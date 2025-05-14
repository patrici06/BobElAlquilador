package com.BobElAlquilador.demo.model;
//Alquiler = {(NombreMaquina(fk), FechaInicio, FechaFin)(PK), DNI(C)(fk)}

import jakarta.persistence.*;

@Entity
@Table (name = "alquiler")
public class Alquiler {
    @EmbeddedId
    private AlquilerID alquiler_id;

    @ManyToOne
    @MapsId ("nombre_maquina")
    @JoinColumn(name = "nombre_maquina")
    private Maquina maquina;

    @ManyToOne
    @JoinColumn (name = "dni_cliente")
    private Cliente cliente;
    public Alquiler(){}

    public Alquiler(AlquilerID alquiler_id, Maquina maquina, Cliente cliente) {
        this.alquiler_id = alquiler_id;
        this.maquina = maquina;
        this.cliente = cliente;
    }

    public AlquilerID getAlquiler_id() {
        return alquiler_id;
    }

    public void setAlquiler_id(AlquilerID alquiler_id) {
        this.alquiler_id = alquiler_id;
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
}
