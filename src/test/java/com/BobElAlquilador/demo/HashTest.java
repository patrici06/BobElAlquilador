package com.BobElAlquilador.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class HashTest {
    @Autowired
    private PasswordEncoder encoder;
    @Test
    public void testHash() {
        String raw = "123456789";
        String hash = "$2a$10$enCuanYPdddpthbQZJAPkuYQEGe7QEsFtMKOCrtRb5RNqxaxg6ibK";
        System.out.println(encoder.encode(raw));// Debe imprimir true
        System.out.println(encoder.matches(raw, hash));
    }
}
