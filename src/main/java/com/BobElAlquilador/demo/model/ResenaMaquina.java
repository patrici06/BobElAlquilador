package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;

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
    @JoinColumn (name = "dni_cliente")
    private Cliente cliente;
    private String comentario;
    private int valoracion;

    public ResenaMaquina() { super();}

    public ResenaMaquina(Long id_resena, Maquina nombreMaquina, Cliente dni, String comentario, int valoracion) {
        super();
        this.id_resena = id_resena;
        this.maquina = nombreMaquina;
        this.cliente = dni;
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

    public Cliente getCliente() {
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
