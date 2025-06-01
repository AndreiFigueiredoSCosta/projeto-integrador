package org.example.mirinayapi.model.pedidos.DTO;

import org.example.mirinayapi.model.enums.itemRequisicao.DestinoItemEnum;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;

import java.math.BigDecimal;

public record ListagemItensPedidosPendentesDTO(
        Long itemId,
        Long fornecedorId,
        String referencia,
        String nomeProduto,
        Long requisicaoId,
        String unidade,
        DestinoEnum destino,
        BigDecimal valorUnitario,
        Integer quantidade,
        String grupo,
        String subgrupo
) {
}
