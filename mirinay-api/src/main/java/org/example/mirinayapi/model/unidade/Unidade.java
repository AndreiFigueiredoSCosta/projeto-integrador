package org.example.mirinayapi.model.unidade;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.model.unidadePossui.UnidadePossui;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Entity(name = "unidade")
@Table(name = "unidade")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Unidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ou GenerationType.AUTO
    @Column(name = "unidade_id")
    private Long unidadeId;
    @NotBlank(message = "Nome da unidade não pode ser vazio")
    private String nome;
    @NotBlank(message = "Sigla da unidade não pode ser vazia")
    @Length(min = 1, max = 3, message = "Sigla da unidade deve ter entre 1 e 3 caracteres")
    private String sigla;

    @JsonIgnore
    private Boolean status;

    @OneToMany(mappedBy = "unidade", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Produto> produtos;

    @OneToMany(mappedBy = "unidade", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Requisicao> requisicoes;

    @OneToMany(mappedBy = "unidade", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UnidadePossui> unidadesPossui;

    @OneToMany(mappedBy = "unidadeDestino", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Pedido> pedidos;
}
