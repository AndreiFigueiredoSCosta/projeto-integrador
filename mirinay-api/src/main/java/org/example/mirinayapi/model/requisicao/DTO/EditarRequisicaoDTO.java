package org.example.mirinayapi.model.requisicao.DTO;

import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;

public record EditarRequisicaoDTO(
        String nome,
        String cliente,
        String observacao,
        DestinoEnum destino,
        PrioridadeEnum prioridade,
        EstagioEnum estagio) {
}
