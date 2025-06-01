package org.example.mirinayapi.model.subgrupo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.grupo.Grupo;
import org.example.mirinayapi.model.produto.Produto;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "subgrupo")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SubGrupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subgrupoId;
    @NotBlank(message = "Nome do subgrupo não pode ser vazio")
    private String nome;
    @NotBlank(message = "Descrição do subgrupo não pode ser vazia")
    private String descricao;

    @JsonIgnore
    private Boolean status;

    private Double margem;

    @OneToMany(mappedBy = "subgrupo")
    @JsonIgnore
    private Set<Produto> produtos;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;
}
