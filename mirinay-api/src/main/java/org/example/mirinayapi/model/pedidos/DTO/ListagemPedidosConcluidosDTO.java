package org.example.mirinayapi.model.pedidos.DTO;

import java.math.BigDecimal;
import java.util.Date;

public record ListagemPedidosConcluidosDTO(
        Long pedidoId,

        String nomeFornecedor,
        BigDecimal valorTotal,
        Boolean nfe, //NfeEnum
        Date dataPedido,
        Date dataPrevisao,
        String unidade,
        String solicitante
) {
}
