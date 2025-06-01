package org.example.mirinayapi.model.grupo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.mirinayapi.model.subgrupo.SubGrupo;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "grupo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long grupoId;
    @NotBlank(message = "Nome do grupo não pode ser vazio")
    private String nome;
    @NotBlank(message = "Descrição do grupo não pode ser vazia")
    private String descricao;

    @JsonIgnore
    private Boolean status;
    @NotNull(message = "Margem do grupo não pode ser vazia")
    private double margem;


    @OneToMany(mappedBy = "grupo")
    @JsonIgnore
    private Set<SubGrupo> subgrupos;
}
