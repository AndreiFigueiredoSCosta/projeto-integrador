package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

import lombok.Builder;

@Builder
public record ListagemSimilaresRevisaoCotacaoDTO(
        Long similarId,
        Boolean selecionado,
        String marca,
        String referencia,
        String observacao
) {
}
