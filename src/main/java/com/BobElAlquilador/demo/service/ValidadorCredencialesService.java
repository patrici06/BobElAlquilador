package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
public class ValidadorCredencialesService {
        @Autowired
        private PersonaRepository pRepo;
        public void formatoValido(String dni, String claveIn, String correo, LocalDate fechaNacimiento){
            dniYaRegistrado(dni);
            correoYaRegistrado(correo);
            formatoClaveValido(claveIn);
            usuarioMenorDeEdad(fechaNacimiento);
        }
        public boolean formatoClaveValido(String clave){
            if (clave.length() < 8 || !clave.matches(".*[A-Z].*") || !clave.matches(".*[a-z].*") || !clave.matches(".*\\d.*")){
                throw new RuntimeException("Contraseña invalida, se espera al menos una mayúscula,\n una minúscula, un número y al menos 8 caracteres");
            }
            return true;
        }

        public boolean usuarioMenorDeEdad (LocalDate fechaNacimiento) {
            boolean ok = Period.between(fechaNacimiento, LocalDate.now()).getYears() <= 18;
            if (!ok) {
                throw new RuntimeException("La persona es menor de edad");
            }
            return true;
        }
        public boolean dniYaRegistrado(String dni){
            if (pRepo.existsPersonaByDni(dni)) {
                throw new RuntimeException("DNI ya registrado");
            }
            return true;
        }
        public boolean correoYaRegistrado(String correo){
            if (pRepo.existsPersonaByEmail(correo)) {
                throw new RuntimeException("Correo electronico ya registrado");
            }
            return true;
        }
}
