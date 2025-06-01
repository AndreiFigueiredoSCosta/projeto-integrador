package org.example.mirinayapi.model.produto.DTO;

import java.math.BigDecimal;
import java.util.Date;

public record DadosValoresDTO(
        String nome,
        BigDecimal valor,
        Date data
) {
}
