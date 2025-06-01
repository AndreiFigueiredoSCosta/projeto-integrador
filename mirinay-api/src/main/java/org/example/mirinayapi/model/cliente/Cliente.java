package org.example.mirinayapi.model.cliente;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;


@Entity(name = "cliente")
@Table(name = "cliente")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cliente_id")
    private Long clienteId;
    @NotBlank
    private String nomeCompleto;
    @NotBlank
    @Column(unique = true)
    private String cpf;
    @NotBlank
    @Column(unique = true)
    private String email;
    @NotBlank
    private String telefone;
    @NotBlank
    private String nascimento;
}
