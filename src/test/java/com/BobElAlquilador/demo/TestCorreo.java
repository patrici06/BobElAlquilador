package com.BobElAlquilador.demo;

import com.BobElAlquilador.demo.model.Alquiler;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.service.CorreoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class TestCorreo {

    @Autowired
    private CorreoService cor;

    private Alquiler alq;

    @BeforeEach
    public void setup() {
        Maquina maq = new Maquina();
        maq.setNombre("TENEMOS MAIL FUNCIONANDO NOMAS VIEJA");
        alq = new Alquiler();
        alq.setMaquina(maq);
    }

    /*
    @Test
    public void testEnvio() {
        assertTrue(cor.enviarCancelacion("joaquinrd0@gmail.com", alq));
        assertTrue(cor.enviarCancelacion("mateodaltroy@gmail.com", alq));
        assertTrue(cor.enviarCancelacion("doloresgarro2@gmail.com", alq));
    }
     */
}
