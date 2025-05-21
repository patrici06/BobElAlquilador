package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Estado;
import com.BobElAlquilador.demo.model.EstadoMaquina;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.repository.MaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public List<Maquina> getMaquinasDisponibles() {
        return maquinaRepository.findAll().stream()
                .filter(maq -> maq.getEstadoMaquina() == EstadoMaquina.Disponible)
                .toList();
    }

    public Maquina subir(String nombre_maquina, String ubicacion, LocalDate fecha_ingreso, String fotoUrl,
                         String descripcion, String tipo, double precio_dia) {
        Maquina nueva = new Maquina(nombre_maquina, ubicacion, fecha_ingreso, fotoUrl, descripcion, tipo, precio_dia);
        if (this.getMaquinaPorNombre(nombre_maquina) != null) {throw new RuntimeException("La maquina \'"+ nombre_maquina +"\' ya se encuentra registrada");}
        return maquinaRepository.save(nueva);
    }

    public void saveMaquina (Maquina maquina){
        maquinaRepository.save(maquina);
    }

    //Borrado Logico
    public void deleteMaquina(Maquina maquina){
        //Se deben Cancelar los alquileres (marcar como cancelado)
        maquina.borrar();
        AlquilerService alquilerService = new AlquilerService();
        alquilerService.cancelarAlquileresMaquina(maquina);
        //Puede que requiera la cancelacion de todos los Alquileres pendientes.
        this.saveMaquina(maquina);
    }
}