package com.BobElAlquilador.demo.service; 
import com.BobElAlquilador.demo.model.IteracionId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.repository.IteracionRepository;
import com.BobElAlquilador.demo.repository.PreguntaRepository;



@Service
public class IteradorService {

    @Autowired
    private IteracionRepository iteracionRepository;
    
    @Autowired
    private PreguntaRepository preguntaRepository;

    public List<Iteracion> getAllIteradores (){
        return this.iteracionRepository.findAll(); 
    }
    public List<Iteracion> getAllIteradoresPorCliente(String email) {
        return iteracionRepository.findAllByPregunta_Cliente_Email(email);
    }
    public List<Iteracion> getAllIteradoresSinRespuesta() {
        return iteracionRepository.findAllByRespuestaIsNull();
    }
    public void subirIterador(Iteracion iteracion) {
        iteracionRepository.save(iteracion);
    }

    public Optional<Iteracion> findByConversacionId(Long idConversacion) {
        return iteracionRepository.findByConversacion_IdConversacion(idConversacion);
    }
    public Optional<Iteracion> findByIdPregunta (Long idPregunta) {
        return iteracionRepository.findByPregunta_IdP(idPregunta);
    }
    public Optional<Iteracion> findById(IteracionId id) {
        return iteracionRepository.findById(id);
    }
}
