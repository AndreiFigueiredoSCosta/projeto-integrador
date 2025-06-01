package org.example.mirinayapi.model.pedidos.DTO;

import java.math.BigDecimal;

public record ListagemIndicesPedidosPendentesDTO(
        Long fornecedorId,
        String nomeFornecedor,

        BigDecimal valorTotal,
        BigDecimal pedidoMinimo,
        String observacao
        )
{
}
