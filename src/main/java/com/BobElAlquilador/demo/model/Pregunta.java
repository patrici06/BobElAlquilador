package com.BobElAlquilador.demo.model;
//Pregunta = {id(pk), DNI(C), Fecha, hora, cuerpo}

import jakarta.persistence.*;

@Entity
@Table (name = "pregunta")
public class Pregunta {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long idP;

    @ManyToOne
    @JoinColumn (name  = "dni_cliente")
    private Cliente cliente;

}
