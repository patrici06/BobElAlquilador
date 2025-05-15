package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Estado;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.repository.MaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaquinaService {
    @Autowired
    public MaquinaRepository maquinaRepository;

    public List<Maquina> getAllMaquinas (){ return maquinaRepository.findAll();}
    public List<Maquina> getMaquinasPorTipo (String tipo){
        return maquinaRepository.findByTipo(tipo);
    }
    public Maquina getMaquinaPorNombre(String nombre){
      return maquinaRepository.findById(nombre).orElse(null);
    }
    public List<Maquina> getMaquinasporUbicacion (String ubicacion){
        return maquinaRepository.findByUbicacion(ubicacion);
    }
    public void saveMaquina (Maquina maquina){
        maquinaRepository.save(maquina);
    }
    //Borrado Logico
    public void deleteMaquina(Maquina manquina){
        manquina.setEstado(Estado.Eliminada);
        this.saveMaquina(manquina);
    }

}
