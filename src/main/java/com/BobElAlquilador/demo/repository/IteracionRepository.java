package com.BobElAlquilador.demo.repository;


import com.BobElAlquilador.demo.model.Iteracion;
import com.BobElAlquilador.demo.model.IteracionId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IteracionRepository extends JpaRepository<Iteracion, IteracionId> {
    List<Iteracion> findByPregunta_Cliente_Email(String email);
    List<Iteracion> findByRespuestaIsNull();
}
