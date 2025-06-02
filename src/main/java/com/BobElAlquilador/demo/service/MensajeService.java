package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Mensaje;
import com.BobElAlquilador.demo.model.Conversacion;
import com.BobElAlquilador.demo.repository.MensajeRepository;
import com.BobElAlquilador.demo.repository.ConversacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private ConversacionRepository conversacionRepository;

    // Crear y guardar un nuevo mensaje asociado a una conversación
    public Mensaje crearMensaje(Long idConversacion, Mensaje mensaje) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversación no encontrada"));

        mensaje.setConversacion(conversacion);
        mensaje.setFechaEnvio(LocalDateTime.now());
        mensaje.disponible(); // Inicializamos como activo usando DbEstado

        return mensajeRepository.save(mensaje);
    }

    // Obtener todos los mensajes de una conversación ordenados por fecha
    public List<Mensaje> obtenerMensajesDeConversacion(Long idConversacion) {
        Conversacion conversacion = conversacionRepository.findById(idConversacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversación no encontrada"));

        return mensajeRepository.findByConversacionOrderByFechaEnvioAsc(conversacion);
    }

    // (Opcional) Borrar un mensaje (soft delete)
    public void borrarMensaje(Mensaje mensaje) {
        mensaje.borrar(); // Cambiar estado a eliminado usando DbEstado
        mensajeRepository.save(mensaje);
    }

    /*public Mensaje obtenerPorId(Long id) {
    return mensajeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mensaje no encontrado"));
}*/
    public List<Mensaje> obtenerTodosLosMensajes() {
        return mensajeRepository.findAll();
    }


}
