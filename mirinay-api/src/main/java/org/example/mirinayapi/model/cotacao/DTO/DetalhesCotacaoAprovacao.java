package org.example.mirinayapi.model.cotacao.DTO;

import java.math.BigDecimal;
import java.util.Date;

public record DetalhesCotacaoAprovacao(
        BigDecimal precoUnit,
        String marca,
        BigDecimal tempoEntrega,
        String observacao
)
{

}
