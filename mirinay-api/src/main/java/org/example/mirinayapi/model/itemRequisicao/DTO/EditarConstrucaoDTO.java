package org.example.mirinayapi.model.itemRequisicao.DTO;

public record EditarConstrucaoDTO(
        Long itemId,
        String referencia,
        Integer quantidade,
        String observacao
) {
}
