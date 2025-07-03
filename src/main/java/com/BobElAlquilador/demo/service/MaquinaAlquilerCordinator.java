package com.BobElAlquilador.demo.service;

import com.BobElAlquilador.demo.model.Maquina;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MaquinaAlquilerCordinator {

    @Autowired
    private MaquinaService maquinaService;

    @Autowired
    private AlquilerService alquilerService;

    public void eliminarMaquinaConCancelacion(String nombreMaquina) {
        Maquina maquina = maquinaService.getMaquinaPorNombre(nombreMaquina);
        if (maquina == null) {
            throw new RuntimeException("La máquina no existe");
        }
        // Borrado lógico
        maquina.borrarMaquina();

        // Cancelar los alquileres pendientes o activos
        alquilerService.cancelarAlquileresMaquina(maquina);

        // Guardar los cambios en la máquina
        maquinaService.saveMaquina(maquina);
    }

}
