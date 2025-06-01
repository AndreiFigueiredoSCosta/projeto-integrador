package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

public record ListagemItensAprovacaoDTO(
        Long itemID,
        String nomeProduto,
        String estado,
        Integer quantidade
) {

}
