package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Tipo;
import com.BobElAlquilador.demo.repository.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TipoService {
    @Autowired
    private TipoRepository tipoRepository;
    public List<Tipo> getAllTipos(){
        return tipoRepository.findAll();
    }
}
