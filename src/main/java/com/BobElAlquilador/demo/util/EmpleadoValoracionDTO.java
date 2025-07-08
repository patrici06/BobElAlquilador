package com.BobElAlquilador.demo.util;

public class EmpleadoValoracionDTO {
    private String email;
    private Double promedio;

    public EmpleadoValoracionDTO(String email, Double promedio) {
        this.email = email;
        this.promedio = promedio;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getPromedio() {
        return promedio;
    }

    public void setPromedio(Double promedio) {
        this.promedio = promedio;
    }
// getters y setters
}