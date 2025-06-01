package org.example.mirinayapi.model.pedidos.DTO;

import lombok.Builder;
import org.example.mirinayapi.model.enums.pedido.TipoFrete;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;

import java.math.BigDecimal;
import java.util.Date;

@Builder
public record ListagemRequisicaoPedidoDTO(
        Long pedidoId,
        Date dataCriacao,
        String unidade,
        BigDecimal valorTotal,
        Date dataPrevista,
        String condPgto,
        String fornecedor,
        String transportador,
        String solicitante,
        TipoFrete frete,

        Boolean nfe

) {
}
