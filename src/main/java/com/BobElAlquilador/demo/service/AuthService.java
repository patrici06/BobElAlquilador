package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Cliente;
import com.BobElAlquilador.demo.model.Empleado;
import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Propietario;
import com.BobElAlquilador.demo.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private ClienteService clienteService;
    @Autowired
    private EmpleadoService empleadoService;
    @Autowired
    private PropietarioService propietarioService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Persona authenticate (String dni, String clave){

        Propietario propietario = propietarioService.findByDniPropietario(dni);
        if (propietario != null && passwordEncoder.matches(propietario.getClave(), clave)){
            return propietario;
        }
        Empleado empleado = empleadoService.findByDniEmpleado(dni);
        if (empleado != null && passwordEncoder.matches(empleado.getClave(), clave)){
            return empleado;
        }
        Cliente cliente  = clienteService.findByDniCliente(dni);
        if(cliente != null && passwordEncoder.matches(cliente.getClave(), clave)){
            return cliente;
        }
        return null;
    }
}
