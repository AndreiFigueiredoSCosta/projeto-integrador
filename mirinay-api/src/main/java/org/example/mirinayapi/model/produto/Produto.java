package org.example.mirinayapi.model.produto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.enums.ProdutoEnum;
import org.example.mirinayapi.model.enums.TipoProdutoEnum;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.model.subgrupo.SubGrupo;
import org.example.mirinayapi.model.unidade.Unidade;
import org.example.mirinayapi.model.unidadePossui.UnidadePossui;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity(name = "produto")
@Table(name = "produto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "produto_id")
    private Long produtoId;
    @NotBlank(message = "Nome do produto não pode ser vazio")
    private String nome;
    @NotBlank(message = "Descrição do produto não pode ser vazia")
    private String descricao;
    @Enumerated(EnumType.STRING)
    private TipoProdutoEnum tipo;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    @JsonIgnore
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonIgnore
    private LocalDateTime updatedAt;

    @JsonIgnore
    private Boolean status;


    @OneToMany(mappedBy = "produto")
    @JsonIgnore
    private List<Similar> produtosSimilares;


    @ManyToOne
    @JoinColumn(name = "subgrupo_id")
    private SubGrupo subgrupo;

    @ManyToOne
    @JoinColumn(name = "unidade_id")
    private Unidade unidade;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "produto_relacionamento",
            joinColumns = @JoinColumn(name = "produto_id"),
            inverseJoinColumns = @JoinColumn(name = "componente_id")
    )
    @JsonIgnore
    private List<Produto> componentes;

    @ManyToMany(mappedBy = "componentes", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Produto> conjuntos;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UnidadePossui> unidadePossui;

    //    @ManyToMany
//    @JoinTable(
//            name = "grupofornecedor",
//            joinColumns = @JoinColumn(name = "codigo_produto"),
//            inverseJoinColumns = @JoinColumn(name = "codigo_fornecedor")
//    )
//    private List<FornecedorCnpj> fornecedores;

}
