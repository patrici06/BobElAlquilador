package com.BobElAlquilador.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

//// Maquina = {Nombre(pk), ubicación(fk)?, FechaIngreso?, URL/PATH+Foto, Descripción,
/// nombreEstado(fk), precioxDía, políticaCancelar}
//Actualizar que requiere Marca(ManytoOne) y Tipo (ManytoMany)
@Entity
@Table (name = "maquina")
public class Maquina extends DbEstado{
    @Id
    @Column (name  = "nombre_maquina")
    private String nombreMaquina;

    private String ubicacion;
    private LocalDate fechaIngreso;
    @Lob
    private String fotoUrl;
    @Lob
    private String descripcion;
    @Enumerated(EnumType.STRING)
    private EstadoMaquina estadoMaquina;
    private double precio_dia;
    private double porcentajeReembolso;

    @ManyToOne
    @JoinColumn(name = "marca_id")
    private Marca marca;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name= "maquina_tipos",
                joinColumns = @JoinColumn(name="nombre_maquina",referencedColumnName="nombre_maquina"),
                inverseJoinColumns = @JoinColumn(name="tipo_id", referencedColumnName = "id")
    )
    private Set<Tipo> tipos;

    public Maquina() {
        super();
    }

    public Maquina(String nombre, String ubicacion, LocalDate fecha, String fotoUrl, String descripcion, Set<Tipo> tipo, double precio, Marca marca, double porcentajeReembolso) {
        this.nombreMaquina = nombre;
        this.ubicacion = ubicacion;
        this.fechaIngreso = fecha;
        this.fotoUrl = fotoUrl;
        this.descripcion = descripcion;
        this.tipos = tipo;
        this.precio_dia = precio;
        this.estadoMaquina = EstadoMaquina.Disponible;
        this.marca = marca;
        this.porcentajeReembolso = porcentajeReembolso;
    }

    public double getPorcentajeReembolso() {
        return porcentajeReembolso;
    }

    public void setPorcentajeReembolso(double porcentajeReembolso) {
        this.porcentajeReembolso = porcentajeReembolso;
    }

    public EstadoMaquina getEstadoMaquina (){
        return this.estadoMaquina;
    }
    public Estado getEstado() {return super.getMiEstado();}

    public void setEstadoMaquina(EstadoMaquina estadoMaquina){
        this.estadoMaquina =  estadoMaquina;
    }

    public void setEstadoMaquinaDisponible(){ this.estadoMaquina = EstadoMaquina.Disponible;}

    public void setEstadoMaquinaMantenimiento(){ this.estadoMaquina = EstadoMaquina.Mantenimiento;}

    public void setEstadoMaquinaDescompuesta(){this.estadoMaquina = EstadoMaquina.Descompuesta;}

    public Marca getMarca() {
        return marca;
    }

    public void setMarca(Marca marca) {}

    public Set<Tipo> getTipo(){ return tipos; }

    public void setTipo(Tipo tipo){ this.tipos.add(tipo);}

    public String getNombre() {
        return nombreMaquina;
    }

    public void setNombre(String nombre) {
        this.nombreMaquina = nombre;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public double getPrecioDia(){return this.precio_dia;}

    public double calcularPrecio(long cantDias) {
        return this.precio_dia * cantDias;
    }

    // Supongo que si borra una maquina es porque esta descompuesta
    // Es decir, esta el DBestado que es activo / eliminado (borrar)
    // Y el estado de maquina (disponible / descompuesta / mantenimiento)
    public void borrarMaquina() {
        this.borrar();
        this.estadoMaquina = EstadoMaquina.Descompuesta;
    }
}
