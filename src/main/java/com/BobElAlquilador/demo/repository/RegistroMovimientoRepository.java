package com.BobElAlquilador.demo.repository;

import com.BobElAlquilador.demo.model.RegistroMovimiento;
import com.BobElAlquilador.demo.model.RegistroMovimientoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroMovimientoRepository extends JpaRepository<RegistroMovimiento, RegistroMovimientoId> {
    //Definir más metodos si los requiere
}
