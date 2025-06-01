package org.example.mirinayapi.model.unidadePossui;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.unidade.Unidade;

@Entity
@Table(name = "unidade_possui")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UnidadePossui {

    @EmbeddedId
    private UnidadePossuiId id;

    @ManyToOne(optional = false)
    @MapsId("unidadeId")
    @JoinColumn(name = "unidade_id", nullable = false)
    private Unidade unidade;

    @ManyToOne(optional = false)
    @MapsId("produtoId")
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;


    @Column(nullable = false)
    private Boolean status;

    public UnidadePossui(Unidade unidade, Produto produto, Long quantidade) {
    }
}