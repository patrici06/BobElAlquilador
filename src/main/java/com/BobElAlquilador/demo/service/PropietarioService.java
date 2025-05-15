package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Propietario;
import com.BobElAlquilador.demo.repository.PropietarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PropietarioService {
    @Autowired
    public PropietarioRepository propietarioRepository;
    public Propietario findByDniPropietario(String dni){
        return propietarioRepository.findById(dni).orElse(null);
    }
    public void savePropietario(Propietario p){
        propietarioRepository.save(p);
    }
}
