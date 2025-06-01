package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

public record ListagemItensCotacaoDTO(
        Long itemID,

        String nomeProduto,
        String referencia,
        String observacao
) {
}
