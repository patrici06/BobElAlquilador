package com.BobElAlquilador.demo.model;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class DbEstado {
    @Enumerated(EnumType.STRING)
    private Estado miEstado;

    public DbEstado() {
        miEstado = Estado.Activo;
    }
    public Estado getMiEstado(){return this.miEstado;}
    public void setMiEstado(Estado estado){ this.miEstado = estado;}
    public void borrar(){
        this.miEstado = Estado.Eliminado;
    }
    public void disponible(){
        this.miEstado = Estado.Activo;
    }
}
