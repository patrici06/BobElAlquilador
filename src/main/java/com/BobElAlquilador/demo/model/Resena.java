package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "resena")
public class Resena extends DbEstado{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dni_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "dni_empleado")
    private Empleado empleado;
    @Lob
    private String comentario;
    private int valoracion;

    public Resena() {
        super();
    }

    public Resena(Cliente cliente, Empleado empleado, String comentario, int valoracion) {
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

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
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
                ", cliente=" + cliente +
                ", empleado=" + empleado +
                ", comentario='" + comentario + '\'' +
                ", valoracion=" + valoracion +
                '}';
    }
}