package org.example.mirinayapi.model.transportador;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.mirinayapi.model.transportadorCnpj.TransportadorCnpj;

import java.util.List;

@Entity
@Table(name = "transportador")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Transportador {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long transportadorId;
    @NotBlank(message = "Nome do transportador não pode ser vazio")
    private String nome;

    @JsonIgnore
    private Boolean status;

    @OneToMany(mappedBy = "transportador", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<TransportadorCnpj> transportadorCnpj;
}
