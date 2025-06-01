package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

import lombok.Builder;

@Builder
public record PostCotacaoRevisaoProdutoSimilarDTO(
        Long itemId,
        Long subgrupoId,
        Long unidadeId,
        Long marcaId,
        String nomeProduto,
        String referencia,
        String descricao,
        String observacao
) {
}
