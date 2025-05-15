package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Cliente;
import com.BobElAlquilador.demo.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {
    @Autowired
    public ClienteRepository clienteRepository;

    public Cliente findByDniCliente(String dni){
        return clienteRepository.findById(dni).orElse(null);
    }
    public void saveCliente(Cliente cliente){
        clienteRepository.save(cliente);
    }
}
