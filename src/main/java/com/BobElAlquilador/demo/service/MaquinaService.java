package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.*;
import com.BobElAlquilador.demo.repository.MaquinaRepository;
import com.BobElAlquilador.demo.util.MaquinaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class MaquinaService {
    @Autowired
    public MaquinaRepository maquinaRepository;
   // @Autowired
   // private AlquilerService alquilerService;

    public List<Maquina> getAllMaquinas() {
        return maquinaRepository.findAll();
    }

    public List<Maquina> getMaquinasPorTipo(String tipo) {
        return maquinaRepository.findByTipos_Nombre(tipo);
    }

    public Maquina getMaquinaPorNombre(String nombre) {
        return maquinaRepository.findById(nombre).orElse(null);
    }

    public List<Maquina> getMaquinasPorUbicacion(String ubicacion) {
        return maquinaRepository.findByUbicacion(ubicacion);
    }

    public List<Maquina> getMaquinasDisponibles() {
        return maquinaRepository.findAll().stream()
                .filter(maq -> maq.getEstadoMaquina() == EstadoMaquina.Disponible)
                .toList();
    }

    public Maquina subir(String nombreMaquina, String ubicacion,
                         LocalDate fechaIngreso, String fotoUrl,
                         String descripcion, Set<Tipo> tipo,
                         Double precioDia, Marca marca, Double porcentaje
    ) {
        Maquina nueva = new Maquina(nombreMaquina, ubicacion, fechaIngreso, fotoUrl, descripcion, tipo, precioDia, marca, porcentaje);
        nueva.setEstadoMaquina(EstadoMaquina.Disponible);
        if (this.getMaquinaPorNombre(nombreMaquina) != null) {
            throw new RuntimeException("La maquina '" + nombreMaquina + "' ya se encuentra registrada");
        }
        return maquinaRepository.save(nueva);
    }

    public void saveMaquina(Maquina maquina) {
        maquinaRepository.save(maquina);
    }


    //LO SAQUE DE ACA PORQUE GENERABA UN CICLO EN SPRING; LO MOVI PARA MAQUINAALQUILERCORDINATOR
//    // Borrado Lógico
   // public void deleteMaquina(String nomMaquina) {
     //   Maquina maquina = maquinaRepository.findById(nomMaquina).orElse(null);
      //  if (maquina == null) {
        //    throw new RuntimeException("La máquina no existe");
       // }
        // Se deben Cancelar los alquileres (marcar como cancelado)
       // maquina.borrar();
        //alquilerService.cancelarAlquileresMaquina(maquina);
        //this.saveMaquina(maquina);
    //}

}