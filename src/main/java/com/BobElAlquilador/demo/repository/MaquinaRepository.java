package com.BobElAlquilador.demo.repository;
import com.BobElAlquilador.demo.model.Maquina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MaquinaRepository extends JpaRepository<Maquina, String> {
    //Buscar Maquinas por Tipo
    List<Maquina> findByTipos_Nombre(String nombreTipo);

    //Buscar por ubicación
    List<Maquina> findByUbicacion(String ubicacion);

}