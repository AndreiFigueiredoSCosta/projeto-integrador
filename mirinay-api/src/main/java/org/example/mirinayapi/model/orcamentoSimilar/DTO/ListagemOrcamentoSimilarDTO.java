package org.example.mirinayapi.model.orcamentoSimilar.DTO;


import lombok.Builder;

import java.math.BigDecimal;
import java.util.Date;


@Builder
public record ListagemOrcamentoSimilarDTO(
        Long similarId,
        String nomeSimilar,
        String marcaSimilar,
        BigDecimal valorAtacado,
        BigDecimal valorVarejo,
        int quantidade,
        String tipoDeMaquina,
        String marcaMaquina
) {
}
