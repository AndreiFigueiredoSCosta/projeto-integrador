package org.example.mirinayapi.model.produtoClonagem;

import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.similar.Similar;


@Entity(name = "produto_clonagem")
@Table(name = "produto_clonagem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoClonagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "produto_clonagem_id")
    private Long produtoClonagemId;

    @ManyToOne
    @JoinColumn(name = "similar_id")
    private Similar similar;

    @ManyToOne
    @JoinColumn(name = "clonagem_id")
    private Clonagem clonagem;
}
