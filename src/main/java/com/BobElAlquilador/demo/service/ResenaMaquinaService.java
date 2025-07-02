package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Estado;
import com.BobElAlquilador.demo.model.ResenaMaquina;
import com.BobElAlquilador.demo.repository.ResenaMaquinaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResenaMaquinaService {
    @Autowired
    public ResenaMaquinaRepository resenaMaquinaRepository;
    public List<ResenaMaquina> findAllByEstado(Estado estado){
        return resenaMaquinaRepository.findAllByMiEstado(estado);
    }
    public List<ResenaMaquina> findAll(){
        return resenaMaquinaRepository.findAll();
    }
    public List<ResenaMaquina> findAllByNombreMaquina(String  nombreMaquina){
        return resenaMaquinaRepository.findAllByMiEstadoAndMaquina_NombreMaquina(Estado.Activo,nombreMaquina);
    }
    public boolean yaComentoMaquina(String email, String nombreMaquina){
        return resenaMaquinaRepository.findFirstByMiEstadoAndCliente_EmailAndMaquina_NombreMaquina(Estado.Activo,email,nombreMaquina) != null;
    }
    public void save(ResenaMaquina resenaMaquina){
        this.resenaMaquinaRepository.save(resenaMaquina);
    }

    public void eliminarResenaMaquina(ResenaMaquina res) {
        if (res == null)
            throw new EntityNotFoundException("No se encontro la reseña de maquina a eliminar por id");
        // Borrado logico actual
        res.borrar();
        resenaMaquinaRepository.save(res);
        //resenaMaquinaRepository.delete(res); <- Borrado fisico si lo preferimos
    }

    public ResenaMaquina getResenaMaquinaPorId(long id) {
        return (resenaMaquinaRepository.findById(id).orElse(null));
    }

    public List<ResenaMaquina> getAllMaquinas() {
        return resenaMaquinaRepository.findAll();
    }

    public List<ResenaMaquina> getAllMaquinasActivasDB() {
        return resenaMaquinaRepository.findAll().stream()
                .filter(res -> res.getMiEstado() == Estado.Activo)
                .toList();
    }
}
