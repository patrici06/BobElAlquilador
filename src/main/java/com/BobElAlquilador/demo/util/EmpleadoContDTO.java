package com.BobElAlquilador.demo.util;

public class EmpleadoContDTO {
    private String email;
    private String nombre;
    private String cantAlquileres;
    public EmpleadoContDTO(String email, String nombre, String cantAlquileres) {
        this.email = email;
        this.nombre = nombre;
        this.cantAlquileres = cantAlquileres;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCantAlquileres() {
        return cantAlquileres;
    }

    public void setCantAlquileres(String cantAlquileres) {
        this.cantAlquileres = cantAlquileres;
    }
}
