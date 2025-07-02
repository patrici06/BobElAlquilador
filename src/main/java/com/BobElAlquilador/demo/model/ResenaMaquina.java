package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

import java.time.LocalDate;

////Reseña Máquina = {NombreMaquina(fk)(pk), DNI(fk), Comentario, valoración}
@Entity
@Table (name = "resena_maquina")
public class ResenaMaquina extends DbEstado{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_resena;

    @ManyToOne
    @JoinColumn (name = "nombre_maquina")
    private Maquina maquina;
    @ManyToOne
    @JoinColumn (name = "email_cliente")
    private Persona cliente;
    private String comentario;
    private int valoracion;
    private LocalDate fechaCreacion;
    public ResenaMaquina() { super();}

    public ResenaMaquina(Maquina nombreMaquina, Persona email, String comentario, int valoracion) {
        super();
        this.maquina = nombreMaquina;
        this.cliente = email;
        this.comentario = comentario;
        this.valoracion = valoracion;
        this.fechaCreacion = LocalDate.now();
    }
    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }
    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public void setId_resena(Long id_resena) {
        this.id_resena = id_resena;
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

    public Persona getPersona() {
        return cliente;
    }

    public Maquina getMaquina() {
        return maquina;
    }

    public void setMaquina(Maquina nombreMaquina) {
        this.maquina = nombreMaquina;
    }

    public Long getId_resena() {
        return id_resena;
    }
}
