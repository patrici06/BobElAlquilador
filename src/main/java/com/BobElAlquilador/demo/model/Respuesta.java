package com.BobElAlquilador.demo.model;
//Respuesta = {(idR(pk), DNI(E), Fecha, hora, cuerpo)}

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table (name = "respuesta")
public class Respuesta {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta")
    private Long id_respuesta;

    @ManyToOne
    @JoinColumn (name = "email_empleado")
    private Persona empleado;

    private LocalDate fecha;
    private LocalTime hora;
    @Lob
    private String cuerpo;
    public Respuesta(){}

    public Respuesta(Persona empleado, LocalDate fecha, LocalTime hora, String cuerpo) {
        this.empleado = empleado;
        this.fecha = fecha;
        this.hora = hora;
        this.cuerpo = cuerpo;
    }

    public Long getIdR() {
        return id_respuesta;
    }

    public void setIdR(Long idR) {
        this.id_respuesta = idR;
    }

    public Persona getPersona() {
        return empleado;
    }

    public void setPersona(Persona empleado) {
        this.empleado = empleado;
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
}
