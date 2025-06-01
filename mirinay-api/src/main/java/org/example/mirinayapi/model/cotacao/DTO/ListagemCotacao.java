package org.example.mirinayapi.model.cotacao.DTO;

import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;

public record ListagemCotacao(
        Long requisicaoId,
        String nome,
        int solicitante,
        PrioridadeEnum prioridade,
        EstagioEnum estagio
) {
}
