package com.BobElAlquilador.demo.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Cliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @Column(length = 20)
    private String dni;

    @Column(length = 50)
    private String nombre;

    @Column(length = 50)
    private String apellido;

    @Column(length = 100)
    private String email;

    @Column(length = 100)
    private String clave;

    @Column(length = 20)
    private String telefono;
}
