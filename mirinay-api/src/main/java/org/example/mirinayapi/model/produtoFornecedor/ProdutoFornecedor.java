package org.example.mirinayapi.model.produtoFornecedor;

import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.similar.Similar;


@Entity(name = "produto_fornecedor")
@Table(name = "produto_fornecedor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoFornecedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "produto_fornecedor_id")
    private Long produtoFornecedorId;
    private Boolean status;


    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Similar produto;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "clonagem_id")
    private Clonagem clonagem;
}
