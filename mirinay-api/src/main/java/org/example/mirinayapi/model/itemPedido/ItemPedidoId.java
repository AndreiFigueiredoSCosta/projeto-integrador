package org.example.mirinayapi.model.itemPedido;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemPedidoId implements Serializable {
    @Column(name = "pedido_id")
    private Long pedidoId;
    @Column(name = "similar_id")
    private Long similarId;
    @Column(name = "cotacao_id")
    private Long cotacaoId;
}
