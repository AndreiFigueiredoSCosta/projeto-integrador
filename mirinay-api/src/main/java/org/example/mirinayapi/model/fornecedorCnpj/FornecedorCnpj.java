package org.example.mirinayapi.model.fornecedorCnpj;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.endereco.Endereco;
import org.example.mirinayapi.model.enums.FornecedorEnum;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "fornecedor_cnpj")
@Table(name = "fornecedor_cnpj")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FornecedorCnpj {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fornecedor_cnpj_id")
    private Long fornecedorCnpjId;
    @NotBlank(message = "Nome do fornecedor não pode ser vazio")
    private String nome;
    @Enumerated(EnumType.STRING)
    private FornecedorEnum tipo;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    @JsonIgnore
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonIgnore
    private LocalDateTime updatedAt;

    private String cnpj;

    private String telefone;

    private String email;

    private String cidade;

    private String estado;

    @Deprecated
    @JsonIgnore
    private Integer desconto;

    @JsonIgnore
    private Boolean status;

    @JsonIgnore
    @Deprecated
    private BigDecimal pedidoMinimo;

    @ManyToOne
    @JoinColumn(name = "endereco_id")
    @JsonIgnore
    @Deprecated
    private Endereco endereco;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    @JsonIgnore
    private Fornecedor fornecedor;

    @OneToMany(mappedBy = "fornecedorCnpj", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Cotacao> cotacoes;

    @OneToMany(mappedBy = "fornecedorCnpj", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Pedido> pedidos;

    //
//    @OneToMany(mappedBy = "fornecedorCnpj", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonIgnore
//    private List<ProdutoFornecedor> produtoFornecedores;
}
