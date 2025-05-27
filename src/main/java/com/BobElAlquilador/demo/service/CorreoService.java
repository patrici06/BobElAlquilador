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

    // Puedes parametrizar el remitente con @Value si lo deseas.
    private static final String REMITENTE = "bobelalquilador.sistema@gmail.com";

    public void enviarMail(String receptor, String tema, String cuerpo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(REMITENTE); // Debe estar verificado en Mailjet
        message.setTo(receptor);
        message.setSubject(tema);
        message.setText(cuerpo);
        mailSender.send(message);
    }

    public void enviarCancelacion(String receptor, Alquiler alq) {
        SimpleMailMessage message = new SimpleMailMessage();
        String nomMaq = alq.getMaquina().getNombre();
        message.setFrom(REMITENTE); // Debe estar verificado en Mailjet
        message.setTo(receptor);
        message.setSubject("Problemas con su alquiler de " + nomMaq);
        message.setText("Sentimos informarle que por motivos extraordinarios, la maquina " + nomMaq + " ya no se encuentra" +
                " disponible para honrar sus alquileres. \n Por esto queremos retribuirle apropiadamente y le pedimos" +
                " que se contacte con nosotros yendo a cualquiera de nuestras sucursales y mostrando este mensaje." +
                "\n\n Nuestras más sinceras disculpas, \n Equipo de Bob el Alquilador.");
        mailSender.send(message);
    }
}