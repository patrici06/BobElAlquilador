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
        double porcentaje = alq.getMaquina().getPorcentajeReembolso();
        double monto = alq.getPrecioTotal() * porcentaje / 100.0;
        String propietarioNombre = alq.getMaquina().getMarca() != null ? alq.getMaquina().getMarca().getNombre() : "el propietario";
        String propietarioEmail = alq.getMaquina().getMarca() != null ? alq.getMaquina().getMarca().getNombre() : ""; // Ajustar si hay email
        message.setFrom(REMITENTE); // Debe estar verificado en Mailjet
        message.setTo(receptor);
        message.setSubject("Problemas con su alquiler de " + nomMaq);
        message.setText("Sentimos informarle que por motivos extraordinarios, la maquina " + nomMaq + " ya no se encuentra" +
                " disponible para honrar sus alquileres. \n Por esto queremos retribuirle apropiadamente y le pedimos" +
                " que se contacte con nosotros yendo a cualquiera de nuestras sucursales y mostrando este mensaje." +
                "\n\n Nuestras más sinceras disculpas, \n Equipo de Bob el Alquilador.");
        mailSender.send(message);
    }

    public void enviarCancelacionCliente(String receptor, Alquiler alq) {
        SimpleMailMessage message = new SimpleMailMessage();
        String nomMaq = alq.getMaquina().getNombre();
        double porcentaje = alq.getMaquina().getPorcentajeReembolso();
        double monto = alq.getPrecioTotal() * porcentaje / 100.0;
        message.setFrom(REMITENTE);
        message.setTo(receptor);
        message.setSubject("Cancelación voluntaria de su alquiler de " + nomMaq);
        message.setText("Usted ha cancelado su alquiler de la máquina '" + nomMaq + "'.\n" +
                "\n" +
                "Por política de cancelación, se le reintegrará el " + porcentaje + "% del valor abonado.\n" +
                "Monto a reintegrar: $" + String.format("%.2f", monto) + "\n" +
                "\n" +
                "Si desea contactar al propietario para más información, puede responder a este correo o comunicarse con la empresa.\n" +
                "\n" +
                "Gracias por utilizar Bob el Alquilador.");
        mailSender.send(message);
    }
}