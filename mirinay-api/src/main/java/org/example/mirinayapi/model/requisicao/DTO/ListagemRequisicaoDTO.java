package org.example.mirinayapi.model.requisicao.DTO;

import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;

public record ListagemRequisicaoDTO(
        Long requisicaoId,
        String nome,
        String solicitante,
        String cliente,
        String observacao,
        DestinoEnum destinoEnum,
        PrioridadeEnum prioridadeEnum,
        EstagioEnum estagioEnum) {
}
