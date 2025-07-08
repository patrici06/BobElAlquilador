package com.BobElAlquilador.demo.repository;


import com.BobElAlquilador.demo.model.Persona;
import com.BobElAlquilador.demo.model.Resena;
import com.BobElAlquilador.demo.util.EmpleadoContDTO;
import com.BobElAlquilador.demo.util.EmpleadoValoracionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    // agregar más metodos de ser necesarios
    public Resena findByEmpleado (Persona empleado);

    List<Resena> findByValoracion(int valoracion);
    @Query("SELECT new com.BobElAlquilador.demo.util.EmpleadoValoracionDTO(r.empleado.email, AVG(r.valoracion)) " +
            "FROM Resena r " +
            "GROUP BY r.empleado.email " +
            "ORDER BY AVG(r.valoracion) DESC")
    List<EmpleadoValoracionDTO> findAllEmpleadosWithPromedioValoracionDesc();

    @Query("SELECT new com.BobElAlquilador.demo.util.EmpleadoContDTO(" +
            "e.email, e.nombre, CAST(COUNT(r) AS string)) " +
            "FROM Resena r " +
            "JOIN r.empleado e " +
            "GROUP BY e.email, e.nombre")
    List<EmpleadoContDTO> cantidadAlquileresPorEmpleado();
}
