package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Alquiler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class CorreoService {
    @Autowired
    private JavaMailSender mailSender;

    public void enviarMail(String receptor, String tema, String cuerpo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("bobelalquilador.sistema@gmail.com");
        message.setTo(receptor);
        message.setSubject(tema);
        message.setText(cuerpo);
        mailSender.send(message);
    }

    public void enviarCancelacion(String receptor, Alquiler alq) {
        SimpleMailMessage message = new SimpleMailMessage();
        String nomMaq = alq.getMaquina().getNombre();
        message.setFrom("bobelalquilador.sistema@gmail.com");
        message.setTo(receptor);
        message.setSubject("Problemas con su alquiler de " + nomMaq);
        message.setText("Sentimos informarle que por motivos extraordinarios, la maquina " + nomMaq + " ya no se encuentra" +
                " diponible para honrar sus alquileres. \n Por esto queremos retribuirle apropiadamente y le pedimos" +
                " que se contacte con nosotros yendo a cualquiera de nuestras sucursales y mostrando este mensaje." +
                "\n\n Nuestras mas sinceras disculpas, \n Equipo de Bob el Alquilador.");
        mailSender.send(message);
    }
}
