package org.example.mirinayapi.model.itemRequisicao.DTO;

import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;

public record InserirItemEmFaseCotacaoDTO(
        String referencia,
        Integer quantidade,
        String observacao,
        String justificativa,
        DestinoEnum destino
) {
}
