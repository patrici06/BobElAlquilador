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
    public void SubirConversacion(Conversacion con){
        this.conversacionRepository.save(con);
    }
}
