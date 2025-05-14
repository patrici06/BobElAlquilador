package com.BobElAlquilador.demo.model;

import java.time.LocalDate;
import jakarta.persistence.*;

//Registro Movimiento = {ubicación(fk), NombreMaquina(fk), FechaIngreso(PK), FechaEgreso}

@Entity
@Table (name = "registro_movimiento")
public class RegistroMovimiento {
    @EmbeddedId
    private RegistroMovimientoId registroMovimientoId;

    @ManyToOne
    @MapsId ("nombre_maquina")
    @JoinColumn (name = "nombre_maquina")
    private Maquina maquina;
    private LocalDate fechaEgreso;

    public RegistroMovimiento() {}

    public RegistroMovimientoId getRegistroMovimientoId() {
        return registroMovimientoId;
    }

    public void setRegistroMovimientoId(RegistroMovimientoId registroMovimientoId) {
        this.registroMovimientoId = registroMovimientoId;
    }

    public Maquina getMaquina() {
        return maquina;
    }

    public LocalDate getFechaEgreso() {
        return fechaEgreso;
    }

    public RegistroMovimiento(RegistroMovimientoId registroMovimientoId, Maquina maquina, LocalDate fechaEgreso) {
        this.registroMovimientoId = registroMovimientoId;
        this.maquina = maquina;
        this.fechaEgreso = fechaEgreso;
    }
}
