package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

import lombok.Builder;

@Builder
public record PostRevisaoCadastrarSimilarDTO(
        Long itemId,
        Long produtoId,
        Long marcaId,
        String referencia,
        String observacao
) {
}
