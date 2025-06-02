package com.BobElAlquilador.demo.service; 
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.repository.IteracionRepository;



@Service
public class IteradorService {

    @Autowired
    IteracionRepository iteracionRepository;

    public List<Iteracion> getAllIteradores (){
        return this.iteracionRepository.findAll(); 
    }
    public List<Iteracion> getAllIteradoresPorCliente (String email){
        return this.iteracionRepository.findByPregunta_Cliente_Email(email);
    }
    public List<Iteracion> getAllIteradoresSinRespuesta(){
        return this.iteracionRepository.findByRespuestaIsNull(); 
    }
    public void subirIterador(Iteracion iterador){
        this.iteracionRepository.save(iterador);
    }
}
