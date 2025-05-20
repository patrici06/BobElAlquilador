package com.BobElAlquilador.demo.model;
//Pregunta = {id(pk), DNI(C), Fecha, hora, cuerpo}

import jakarta.persistence.*;
import org.springframework.scheduling.support.SimpleTriggerContext;
import com.BobElAlquilador.demo.model.Persona;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table (name = "pregunta")
public class Pregunta {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long idP;

    @ManyToOne
    @JoinColumn (name  = "persona_dni")
    private Persona cliente;
    private LocalDate fecha;
    private LocalTime hora;
    @Lob
    
    private String cuerpo;

    public Pregunta(){
        
    }

    public Pregunta(Persona cliente, LocalDate fecha, LocalTime hora, String cuerpo) {
        this.cliente = cliente;
        this.fecha = fecha;
        this.hora = hora;
        this.cuerpo = cuerpo;
    }

    public Long getIdP() {
        return idP;
    }

    public Persona getCliente() {
        return cliente;
    }

    public void setCliente(Persona cliente) {
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

    //---------------------------------------------------
    // Agrego esto para vincular una pregunta con una rta
    @OneToOne
    @JoinColumn(name = "id_respuesta")
    private Respuesta respuesta;

    public Respuesta getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(Respuesta respuesta) {
        this.respuesta = respuesta;
    }

    // agrego esto para testear 
    public void setIdP(Long idPregunta) {
        // TODO Auto-generated method stub
            this.idP = idPregunta;
    }

    //---------------------------------------------------
    
    
    //---------------------------------------------------
    // Agrego esto para vincular respuesta del cliente 
    // con rta del empleado
    @OneToOne
    @JoinColumn(name = "id_pregunta_respuesta")
    private Pregunta respuestaDelCliente;

    @OneToOne(mappedBy = "respuestaDelCliente")
    private Pregunta preguntaOriginal;

    public Object getRespuestaDelCliente() {
        return respuestaDelCliente;
    }

    public void setRespuestaDelCliente(Pregunta respuestaDelCliente) {
        this.respuestaDelCliente = respuestaDelCliente;
    }

    public void setPreguntaOriginal(Pregunta preguntaOriginal) {
        this.preguntaOriginal = preguntaOriginal;
    }

    public Pregunta getPreguntaOriginal() {
        return preguntaOriginal;
    }





}

    
    
