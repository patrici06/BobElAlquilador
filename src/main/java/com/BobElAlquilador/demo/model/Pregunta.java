package com.BobElAlquilador.demo.model;
//Pregunta = {id(pk), DNI(C), Fecha, hora, cuerpo}

import jakarta.persistence.*;
import org.springframework.scheduling.support.SimpleTriggerContext;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table (name = "pregunta")
public class Pregunta {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long idP;

    @ManyToOne
    @JoinColumn (name  = "dni_cliente")
    private Cliente cliente;
    private LocalDate fecha;
    private LocalTime hora;
    @Lob
    private String cuerpo;

    public Long getIdP() {
        return idP;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getCuerpo() {
        return cuerpo;
    }

    public void setCuerpo(String cuerpo) {
        this.cuerpo = cuerpo;
    }

    public Pregunta(){}
    public Pregunta(Cliente cliente, LocalDate fecha, LocalTime hora, String cuerpo) {
        this.cliente = cliente;
        this.fecha = fecha;
        this.hora = hora;
        this.cuerpo = cuerpo;
    }

}
