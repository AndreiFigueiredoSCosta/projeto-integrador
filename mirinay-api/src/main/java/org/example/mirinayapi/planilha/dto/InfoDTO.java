package org.example.mirinayapi.planilha.dto;

import java.math.BigDecimal;
import java.util.List;

public record InfoDTO(
        String produto,
        String solicitante,
        String descricao,
        List<String> referencias,
        String fornecedor,
        String marca,
        Integer quantidade,
        BigDecimal preco
) {
}
