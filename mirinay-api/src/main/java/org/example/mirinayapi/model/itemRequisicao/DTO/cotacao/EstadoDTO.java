package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;

public record EstadoDTO(
        EstadoItemEnum estado
) {
}
