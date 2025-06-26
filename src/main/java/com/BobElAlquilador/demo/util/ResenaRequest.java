package com.BobElAlquilador.demo.util;

public class ResenaRequest {
    public String dniCliente;
    public String emailEmpleado;
    public String comentario;
    public int valoracion;

    @Override
    public String toString() {
        return "ResenaRequest{" +
                "dniCliente='" + dniCliente + '\'' +
                ", emailEmpleado='" + emailEmpleado + '\'' +
                ", comentario='" + comentario + '\'' +
                ", valoracion=" + valoracion +
                '}';
    }
}