package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "retiro")
public class Retiro extends DbEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Un retiro corresponde a un alquiler específico
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "nombre_maquina", referencedColumnName = "nombre_maquina"),
            @JoinColumn(name = "fecha_inicio", referencedColumnName = "fechaInicio"),
            @JoinColumn(name = "fecha_fin", referencedColumnName = "fechaFin")
    })
    private Alquiler alquiler;

    // Empleado que realiza el retiro
    @ManyToOne
    @JoinColumn(name = "empleado_email", referencedColumnName = "email")
    private Persona empleado;

    private LocalDate fechaRetiro;

    // ==================== CONSTRUCTORES ====================

    public Retiro() {
        super();
    }

    public Retiro(Alquiler alquiler, Persona empleado, LocalDate fechaRetiro) {
        super();
        this.alquiler = alquiler;
        this.empleado = empleado;
        this.fechaRetiro = fechaRetiro;
    }

    // ==================== GETTERS Y SETTERS ====================

    public Long getId() {
        return id;
    }

    public Alquiler getAlquiler() {
        return alquiler;
    }

    public void setAlquiler(Alquiler alquiler) {
        this.alquiler = alquiler;
    }

    public Persona getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Persona empleado) {
        this.empleado = empleado;
    }

    public LocalDate getFechaRetiro() {
        return fechaRetiro;
    }

    public void setFechaRetiro(LocalDate fechaRetiro) {
        this.fechaRetiro = fechaRetiro;
    }

    @Override
    public String toString() {
        return "Retiro{" +
                "id=" + id +
                ", alquiler=" + alquiler +
                ", empleado=" + empleado +
                ", fechaRetiro=" + fechaRetiro +
                '}';
    }
}