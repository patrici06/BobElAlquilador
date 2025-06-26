package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "resena")
public class Resena extends DbEstado{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dni_cliente", referencedColumnName = "dni")
    private Persona cliente;

    @ManyToOne
    @JoinColumn(name = "email_empleado", referencedColumnName = "email")
    private Persona empleado;
    @Lob
    private String comentario;
    private int valoracion;
    private LocalDate fechaRealizada;
    public Resena() {
        super();
        this.fechaRealizada = LocalDate.now();
    }

    public Resena(Persona cliente, Persona empleado, String comentario, int valoracion) {
        super();
        this.cliente = cliente;
        this.empleado = empleado;
        this.comentario = comentario;
        this.valoracion = valoracion;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Persona getCliente() {
        return cliente;
    }

    public void setCliente(Persona cliente) {
        this.cliente = cliente;
    }

    public Persona getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Persona empleado) {
        this.empleado = empleado;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public int getValoracion() {
        return valoracion;
    }

    public void setValoracion(int valoracion) {
        this.valoracion = valoracion;
    }

    @Override
    public String toString() {
        return "Resena{" +
                "id=" + id +
                ", cliente=" + cliente.toString() +
                ", empleado=" + empleado.toString() +
                ", comentario='" + comentario + '\'' +
                ", valoracion=" + valoracion +
                '}';
    }
}