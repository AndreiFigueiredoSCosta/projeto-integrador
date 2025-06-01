package org.example.mirinayapi.model.similar;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.enums.ProdutoEnum;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;
import org.example.mirinayapi.model.marca.Marca;
import org.example.mirinayapi.model.produto.Produto;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "produto_similar")
@Table(name = "produto_similar")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Similar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "similar_id")
    private Long similarId;
    @NotBlank(message = "Referencia não pode ser vazia")
    private String referencia;

    @Enumerated(EnumType.STRING)
    private ProdutoEnum tipo;

    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    @JsonIgnore
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonIgnore
    private LocalDateTime updatedAt;
    private String observacao;
    private Integer quantidadeEstoque;

    @JsonIgnore
    private Boolean status;


    @ManyToOne
    @JoinColumn(name = "produto_id")
    @JsonIgnore
    private Produto produto;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProdutoFornecedor> produtoFornecedores;

    @ManyToOne
    @JoinColumn(name = "marca_id")
    private Marca marca;

    @OneToMany(mappedBy = "similar", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ItemRequisicao> itensRequisicao;

    @Override
    public String toString() {
        return "Similar{" +
                "similarId=" + similarId +
                ", referencia='" + referencia + '\'' +
                ", tipo=" + tipo +
                ", observacao='" + observacao + '\'' +
                ", status=" + status +
                '}';
    }

    public Similar(Long similarId, String referencia, Marca marca, int quantidadeEstoque) {
        this.similarId = similarId;
        this.referencia = referencia;
        this.marca = marca;
        this.quantidadeEstoque = quantidadeEstoque;
    }
}
