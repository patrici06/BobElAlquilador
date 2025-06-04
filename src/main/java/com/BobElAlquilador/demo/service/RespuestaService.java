package com.BobElAlquilador.demo.service;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.IteracionId;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Respuesta;
import com.BobElAlquilador.demo.repository.RespuestaRepository;
import com.BobElAlquilador.demo.repository.IteracionRepository;

@Service
public class RespuestaService {

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private IteracionRepository iteracionRepository;


    public Respuesta save(Respuesta respuesta){
       return respuestaRepository.save(respuesta);
    }
}

