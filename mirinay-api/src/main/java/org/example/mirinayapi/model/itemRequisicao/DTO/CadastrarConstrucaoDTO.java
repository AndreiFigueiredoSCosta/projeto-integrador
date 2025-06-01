package org.example.mirinayapi.model.itemRequisicao.DTO;

import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;

public record CadastrarConstrucaoDTO(
        String referencia,
        Integer quantidade,
        String observacao,
        DestinoEnum destino
) {

}
