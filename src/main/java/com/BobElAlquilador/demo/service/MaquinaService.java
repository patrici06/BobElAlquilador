package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Estado;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.repository.MaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
       //Se deben Cancelar los alquileres (marcar como cancelado)
         manquina.borrar();
        //Puede que requiera la cancelacion de todos los Alquileres pendientes.
        this.saveMaquina(manquina);
    }

}
