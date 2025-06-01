package org.example.mirinayapi.model.cotacao.DTO.cotacao;

import lombok.Builder;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;

@Builder
public record GetCotacaoItemDTO(
        Long itemId,
        Long produtoId,
        Long similarId,
        String nomeProduto,
        String observacao,
        Integer quantidade,
        EstadoItemEnum estado,
        String marca
) {
}
