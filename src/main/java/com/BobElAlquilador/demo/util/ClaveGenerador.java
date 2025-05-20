package com.BobElAlquilador.demo.util;
import org.springframework.context.annotation.Bean;

import java.security.SecureRandom;

public class ClaveGenerador {

    private static final String MAYUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
    private static final String NUMEROS = "0123456789";
    private static final String ESPECIALES = "!@#$%&*()-_=+";
    private static final String TODOS = MAYUSCULAS + MINUSCULAS + NUMEROS + ESPECIALES;
    private static final SecureRandom random = new SecureRandom();

    public static String generar(int longitud) {
        if (longitud < 8) throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");

        StringBuilder sb = new StringBuilder();
        // Al menos 1 de cada tipo
        sb.append(MAYUSCULAS.charAt(random.nextInt(MAYUSCULAS.length())));
        sb.append(MINUSCULAS.charAt(random.nextInt(MINUSCULAS.length())));
        sb.append(NUMEROS.charAt(random.nextInt(NUMEROS.length())));
        sb.append(ESPECIALES.charAt(random.nextInt(ESPECIALES.length())));

        // Rellenar el resto
        for (int i = 4; i < longitud; i++) {
            sb.append(TODOS.charAt(random.nextInt(TODOS.length())));
        }

        // Mezclar resultado
        return mezclar(sb.toString());
    }

    private static String mezclar(String input) {
        char[] a = input.toCharArray();
        for (int i = a.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        return new String(a);
    }
}
