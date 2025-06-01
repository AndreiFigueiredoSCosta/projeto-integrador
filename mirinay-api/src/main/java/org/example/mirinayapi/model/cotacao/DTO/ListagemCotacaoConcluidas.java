package org.example.mirinayapi.model.cotacao.DTO;

import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;

public record ListagemCotacaoConcluidas(
        Long requisicaoId,
        String nome,
        Integer solicitante,
        Boolean aprovada,
        DestinoEnum destino
) {
}
