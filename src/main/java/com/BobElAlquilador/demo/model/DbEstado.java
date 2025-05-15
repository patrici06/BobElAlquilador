package com.BobElAlquilador.demo.model;

import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class DbEstado {
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
