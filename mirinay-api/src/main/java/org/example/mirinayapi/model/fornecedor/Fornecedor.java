package org.example.mirinayapi.model.fornecedor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.alertaFornecedor.AlertaFornecedor;
import org.example.mirinayapi.model.classificacaoFornecedor.ClassificacaoFornecedor;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;

import java.util.List;

@Entity(name = "fornecedor")
@Table(name = "fornecedor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fornecedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fornecedor_id")
    private Long fornecedorId;
    @NotBlank(message = "Nome do fornecedor não pode ser vazio")
    private String nome;

    @JsonIgnore
    private Boolean status;


    @OneToMany(mappedBy = "fornecedor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FornecedorCnpj> fornecedores;


    @OneToMany(mappedBy = "fornecedor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<AlertaFornecedor> alertas;

    @OneToMany(mappedBy = "fornecedor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ClassificacaoFornecedor> classificacoes;

    @OneToMany(mappedBy = "fornecedor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProdutoFornecedor> produtoFornecedores;


    public Fornecedor(String nome, Boolean status) {
        this.nome = nome;
        this.status = status;
    }
}
