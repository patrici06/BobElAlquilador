package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Empleado;
import com.BobElAlquilador.demo.model.Resena;
import com.BobElAlquilador.demo.repository.ResenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResenaService {
    @Autowired
    public ResenaRepository resenaRepository;

    public Resena findByEmpleadoRena(Empleado empleado){
        return this.resenaRepository.findByEmpleado(empleado);
    }
    public List<Resena> getAllResena(){
        return resenaRepository.findAll();
    }
}
