package com.BobElAlquilador.demo.model;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class DbEstado {
    @Enumerated(EnumType.STRING)
    private  Estado MiEstado;

    public DbEstado() {
        MiEstado = Estado.Activo;
    }
    public Estado getEstado(){return this.MiEstado;}
    public void borrar(){
        this.MiEstado = Estado.Eliminado;
    }
    public void disponible(){
        this.MiEstado = Estado.Activo;
    }
}
