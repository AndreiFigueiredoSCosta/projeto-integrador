package org.example.mirinayapi.model.listaProdutos;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;
import org.example.mirinayapi.model.produto.Produto;
//import org.example.mirinayapi.model.requisicao.Requisicao;

@Entity(name = "lista_produtos")
@Table(name = "lista_produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListaProduto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull(message = "Quantidade não pode ser nula")
    private Integer quantidade;
    private Boolean aprovacao;

    @ManyToOne
    @JoinColumn(name = "id_produto")
    private Produto produto;

    /*@ManyToOne
    @JoinColumn(name = "codigo_requisicao")
    private Requisicao requisicao;*/

    @ManyToOne
    @JoinColumn(name = "codigo")
    private ProdutoFornecedor produtoFornecedor;

    public boolean aprovarItem() {
        this.aprovacao = true;
        return this.aprovacao;
    }
}

