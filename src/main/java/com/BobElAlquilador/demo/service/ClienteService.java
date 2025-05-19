package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Cliente;
import com.BobElAlquilador.demo.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {
    @Autowired
    public ClienteRepository clienteRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Cliente findByDniCliente(String dni){
        return clienteRepository.findById(dni).orElse(null);
    }
    public void updateCliente (Cliente cliente){
       clienteRepository.save(cliente);
    }
    public void saveCliente(Cliente cliente){
        cliente.setClave(passwordEncoder.encode(cliente.getClave()));
        clienteRepository.save(cliente);
    }
}
