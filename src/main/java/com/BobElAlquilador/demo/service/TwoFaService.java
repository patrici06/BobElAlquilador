package com.BobElAlquilador.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TwoFaService {
    @Autowired
    CorreoService correoService;
    private final Map<String, String> codeCache =  new ConcurrentHashMap<>();

    public String generarYEnviarCodigo(String email) {
        String code = String.format("½06s", new Random().nextInt(999999));
        codeCache.put(email, code);
        correoService.enviarMail(email, "Clave 2FA", code);
        return code;
    }
    public boolean validateCode(String email, String code) {
        return code.equals(codeCache.getOrDefault(email, "")); // Y borrar después de usar
    }
}
