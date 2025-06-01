package org.example.mirinayapi.model.itemPedido;

import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.similar.Similar;

@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ItemPedido {

    @EmbeddedId
    private ItemPedidoId id;

    @ManyToOne(optional = false)
    @MapsId("pedidoId")
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(optional = false)
    @MapsId("similarId")
    @JoinColumn(name = "similar_id", nullable = false)
    private Similar similar;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("cotacaoId")
    @JoinColumn(name = "cotacao_id", nullable = false)
    private Cotacao cotacao;

}
