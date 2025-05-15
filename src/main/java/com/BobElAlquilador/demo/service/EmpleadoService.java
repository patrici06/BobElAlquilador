package com.BobElAlquilador.demo.service;


import com.BobElAlquilador.demo.model.Empleado;
import com.BobElAlquilador.demo.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoService {
    @Autowired
    public EmpleadoRepository empleadoRepository;
    public List<Empleado> findAllEmpleados(){ return empleadoRepository.findAll();}
    public Empleado findByDniEmpleado(String dni){
        return empleadoRepository.findById(dni).orElse(null);
    }
    public void saveEmpleado(Empleado empleado){
        empleadoRepository.save(empleado);
    }
}
