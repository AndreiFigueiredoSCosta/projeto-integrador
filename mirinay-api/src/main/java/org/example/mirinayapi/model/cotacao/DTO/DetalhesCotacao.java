package org.example.mirinayapi.model.cotacao.DTO;

import java.math.BigDecimal;

public record DetalhesCotacao(
        Number precoUnit,
        String marca,
        String observacao
) {
}
