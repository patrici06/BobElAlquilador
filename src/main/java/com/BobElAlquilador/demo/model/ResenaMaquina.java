package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

////Reseña Máquina = {NombreMaquina(fk)(pk), DNI(fk), Comentario, valoración}
@Entity
@Table (name = "resena_maquina")
public class ResenaMaquina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_resena;

    @ManyToOne
    @JoinColumn (name = "nombre_maquina")
    private String nombreMaquina;
    @JoinColumn (name = "dni_cliente")
    @ManyToOne
    private Cliente dni;
    private String comentario;
    private int valoracion;

    public ResenaMaquina() {}

    public ResenaMaquina(Long id_resena, String nombreMaquina, Cliente dni, String comentario, int valoracion) {
        this.id_resena = id_resena;
        this.nombreMaquina = nombreMaquina;
        this.dni = dni;
        this.comentario = comentario;
        this.valoracion = valoracion;
    }

    public int getValoracion() {
        return valoracion;
    }

    public void setValoracion(int valoracion) {
        this.valoracion = valoracion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Cliente getDni() {
        return dni;
    }

    public String getNombreMaquina() {
        return nombreMaquina;
    }

    public void setNombreMaquina(String nombreMaquina) {
        this.nombreMaquina = nombreMaquina;
    }

    public Long getId_resena() {
        return id_resena;
    }
}
