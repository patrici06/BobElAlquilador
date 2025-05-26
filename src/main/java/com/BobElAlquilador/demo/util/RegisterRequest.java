package com.BobElAlquilador.demo.util;

import com.BobElAlquilador.demo.model.Rol;

import java.time.LocalDate;
import java.util.Set;

public class RegisterRequest {
        private String dni;
        private String nombre;
        private String apellido;
        private String email;
        private String clave;
        private String telefono;
        private LocalDate fechaNacimiento;
        private Set<String> roles; // Ej: ["PROPIETARIO", "EMPLEADO"]

        public LocalDate getFechaNacimiento() {
                return fechaNacimiento;
        }

        public void setFechaNacimiento(LocalDate fechaNacimiento) {
                this.fechaNacimiento = fechaNacimiento;
        }

        public String getDni() {
                return dni;
        }

        public void setDni(String dni) {
                this.dni = dni;
        }

        public String getNombre() {
                return nombre;
        }

        public void setNombre(String nombre) {
                this.nombre = nombre;
        }

        public String getApellido() {
                return apellido;
        }

        public void setApellido(String apellido) {
                this.apellido = apellido;
        }

        public String getEmail() {
                return email;
        }

        public void setEmail(String email) {
                this.email = email;
        }

        public String getClave() {
                return clave;
        }

        public void setClave(String clave) {
                this.clave = clave;
        }

        public String getTelefono() {
                return telefono;
        }

        public void setTelefono(String telefono) {
                this.telefono = telefono;
        }

        public Set<String> getRoles() {
                return roles;
        }

        public void setRoles(Set<String> roles) {
                this.roles = roles;
        }
}

