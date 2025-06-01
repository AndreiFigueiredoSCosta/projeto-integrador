package org.example.mirinayapi.model.itemRequisicao.DTO;

import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;

public record ListagemItensRequisicaoCotacaoDTO(
        Long itemId,
        String referencia,
        Integer quantidade,
        String observacao,
        EstadoItemEnum estado
) {
}
