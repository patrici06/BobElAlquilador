package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ValidadorCredencialesService {
        @Autowired
        private PersonaRepository pRepo;
        public void formatoValido(String dni, String claveIn, String correo){
            if (pRepo.existsPersonaByDni(dni)) {
                throw new RuntimeException("DNI ya registrado");
            }
            if (pRepo.existsPersonaByEmail(correo)) {
                throw new RuntimeException("Correo electronico ya registrado");
            }
            //Contraseña invalida, se espera al menos una mayúscula, minuscula y numero
            String clave = claveIn;
            if (clave.length() < 8 || !clave.matches(".*[A-Z].*") || !clave.matches(".*[a-z].*") || !clave.matches(".*\\d.*")){
                throw new RuntimeException("Contraseña invalida, se espera al menos una mayúscula, una minúscula y un número");
            }
        }
}
