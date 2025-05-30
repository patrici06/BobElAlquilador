package com.BobElAlquilador.demo.util;

import com.BobElAlquilador.demo.model.EstadoMaquina;
import com.BobElAlquilador.demo.model.Marca;
import com.BobElAlquilador.demo.model.Tipo;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;

public class MaquinaRequest {

    private String nombreMaquina;
    private String ubicacion;
    private LocalDate fechaIngreso;
    private MultipartFile foto;
    private String descripcion;
    private Set<Integer> tiposIds;
    private Integer marcaId;
    private EstadoMaquina estadoMaquina;
    private double precioDia;

    public Set<Integer> getTiposIds() {
        return tiposIds;
    }

    public void setTiposIds(Set<Integer> tiposIds) {
        this.tiposIds = tiposIds;
    }

    public Integer getMarcaId() {
        return marcaId;
    }

    public void setMarcaId(Integer marcaId) {
        this.marcaId = marcaId;
    }

    // Getter y Setter para nombreMaquina
    public String getNombreMaquina() {
        return nombreMaquina;
    }

    public void setNombreMaquina(String nombreMaquina) {
        this.nombreMaquina = nombreMaquina;
    }

    // Getter y Setter para ubicacion
    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    // Getter y Setter para fechaIngreso
    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    // Getter y Setter para fotoUrl
    public MultipartFile getFoto() {
        return foto;
    }

    public void setFoto(MultipartFile foto) {
        this.foto = foto;
    }

    // Getter y Setter para descripcion
    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // Getter y Setter para estadoMaquina
    public EstadoMaquina getEstadoMaquina() {
        return estadoMaquina;
    }

    public void setEstadoMaquina(EstadoMaquina estadoMaquina) {
        this.estadoMaquina = estadoMaquina;
    }

    // Getter y Setter para precioDia
    public double getPrecioDia() {
        return precioDia;
    }

    public void setPrecioDia(double precioDia) {
        this.precioDia = precioDia;
    }
}