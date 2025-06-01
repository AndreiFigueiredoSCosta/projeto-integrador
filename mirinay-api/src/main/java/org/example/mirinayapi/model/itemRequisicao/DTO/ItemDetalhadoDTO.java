package org.example.mirinayapi.model.itemRequisicao.DTO;

public record ItemDetalhadoDTO(
        String nomeProduto,
        Integer quantidade,
        String grupo,
        String subgrupo,
        String requisicaoId,
        String nomeRequisicao
) {
}
