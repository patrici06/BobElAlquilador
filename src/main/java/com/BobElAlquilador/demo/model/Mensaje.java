package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensaje")
public class Mensaje extends DbEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_mensaje;

    @ManyToOne
    @JoinColumn(name = "id_conversacion")
    private Conversacion conversacion;

    @Column(nullable = false, length = 1000) // limita el contenido del mensaje a 1000 caracteres
    private String contenido;

    @Enumerated(EnumType.STRING)             // indica si el mensaje lo envió el cliente o el empleado
    @Column(nullable = false)
    private RolEmisor rolEmisor;

    @Column(nullable = false)                // guarda fecha y hora de envío del mensaje
    private LocalDateTime fechaEnvio;


    public Mensaje() {
        super();
    }

    public Mensaje(String contenido, RolEmisor rolEmisor, LocalDateTime fechaEnvio) {
        super();
        this.contenido = contenido;
        this.rolEmisor = rolEmisor;
        this.fechaEnvio = fechaEnvio;
    }

    public Long getId_mensaje() {
        return id_mensaje;
    }

    public void setId_mensaje(Long id_mensaje) {
        this.id_mensaje = id_mensaje;
    }

    public Conversacion getConversacion() {
        return conversacion;
    }

    public void setConversacion(Conversacion conversacion) {
        this.conversacion = conversacion;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public RolEmisor getRolEmisor() {
        return rolEmisor;
    }

    public void setRolEmisor(RolEmisor rolEmisor) {
        this.rolEmisor = rolEmisor;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

}
