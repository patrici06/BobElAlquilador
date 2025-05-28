package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Conversacion;
import com.BobElAlquilador.demo.model.Mensaje;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.RolEmisor;
import com.BobElAlquilador.demo.repository.ConversacionRepository;
import com.BobElAlquilador.demo.repository.MensajeRepository; // Importar MensajeRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConversacionService {

    @Autowired
    private ConversacionRepository conversacionRepository;

    @Autowired
    private MensajeRepository mensajeRepository; // Inyectar MensajeRepository

    public Conversacion crearConversacion(Conversacion conversacion) {
        conversacion.setFechaCreacion(LocalDateTime.now());
        conversacion.disponible(); // Estado pendiente
        Conversacion guardada = conversacionRepository.save(conversacion);

        // Crear mensaje inicial del cliente
        Mensaje mensajeInicial = new Mensaje();
        mensajeInicial.setConversacion(guardada);
        mensajeInicial.setContenido("Consulta inicial del cliente."); // O adaptalo según lo que quieras mostrar
        mensajeInicial.setFechaEnvio(LocalDateTime.now());
        mensajeInicial.setMiEstado(0); // Si tu mensaje tiene estados, lo seteás aquí
        mensajeInicial.setRolEmisor(RolEmisor.CLIENTE);

        mensajeRepository.save(mensajeInicial);

        return guardada;
    }

    public List<Conversacion> obtenerTodas() {
        return conversacionRepository.findAll();
    }

    public Conversacion obtenerPorId(Long id) {
        return conversacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada"));
    }

    public List<Conversacion> obtenerPorCliente(Persona cliente) {
        return conversacionRepository.findByCliente(cliente);
    }

    public List<Conversacion> obtenerPorEmpleado(Persona empleado) {
        return conversacionRepository.findByEmpleado(empleado);
    }

    public void borrarConversacion(Conversacion conversacion) {
        conversacion.borrar();
        conversacionRepository.save(conversacion);
    }

    public List<Conversacion> obtenerConversacionesPendientesEmpleado() {
        return conversacionRepository.findConversacionesPendientesEmpleado();
    }
}
