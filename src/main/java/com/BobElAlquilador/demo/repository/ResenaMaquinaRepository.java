package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.Estado;
import com.BobElAlquilador.demo.model.ResenaMaquina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaMaquinaRepository extends JpaRepository<ResenaMaquina, Long> {
    List<ResenaMaquina> findAllByMiEstado(Estado estado);

    List<ResenaMaquina> findAllByMiEstadoAndMaquina_NombreMaquina(Estado estado, String nombreMaquina);
    // definir más metodos de requerirse.
    ResenaMaquina findFirstByMiEstadoAndCliente_EmailAndMaquina_NombreMaquina(Estado estado, String email, String nombreMaquina);
}
