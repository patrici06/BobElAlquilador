package com.BobElAlquilador.demo.service;


import com.BobElAlquilador.demo.model.Empleado;
import com.BobElAlquilador.demo.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoService {
    @Autowired
    public EmpleadoRepository empleadoRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Empleado> findAllEmpleados(){ return empleadoRepository.findAll();}
    public Empleado findByDniEmpleado(String dni){
        return empleadoRepository.findById(dni).orElse(null);
    }
    public void updateEmpleado(Empleado  empleado){
        empleadoRepository.save(empleado);
    }
    public void saveEmpleado(Empleado empleado){
        empleado.setClave(passwordEncoder.encode(empleado.getClave()));
        empleadoRepository.save(empleado);
    }
}
