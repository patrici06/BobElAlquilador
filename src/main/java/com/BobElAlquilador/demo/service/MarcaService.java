package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Marca;
import com.BobElAlquilador.demo.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MarcaService {
    @Autowired
    private MarcaRepository marcaRepository;
    public List<Marca> getAllMarcas(){
        return this.marcaRepository.findAll();
    }
    public Optional<Marca> getMarcaById(Integer idMarca){
        return this.marcaRepository.findById(idMarca);
    }
}
