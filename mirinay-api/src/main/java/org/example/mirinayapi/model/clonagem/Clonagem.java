package org.example.mirinayapi.model.clonagem;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.clonagem.DTO.CadastrarClonagemDTO;
import org.example.mirinayapi.model.fornecedorClonagem.FornecedorClonagem;
import org.example.mirinayapi.model.produtoClonagem.ProdutoClonagem;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.List;

@Entity(name = "clonagem")
@Table(name = "clonagem")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Clonagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clonagemId;
    @NotBlank(message = "Nome da clonagem não pode ser vazio")
    private String nome;
    private Boolean status;


    @OneToMany(mappedBy = "clonagem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProdutoFornecedor> produtoFornecedor;

    @OneToMany(mappedBy = "clonagem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FornecedorClonagem> fornecedorClonagems;

    @OneToMany(mappedBy = "clonagem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProdutoClonagem> produtoClonagems;

    public CadastrarClonagemDTO toDTO() {
        return CadastrarClonagemDTO.builder()
                .nome(nome)
                .build();
    }
}
