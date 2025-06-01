package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

import java.math.BigDecimal;

public record PutCotacaoCotarFornecedorDTO(
        Integer quantidade,
        BigDecimal valorUnitario,
        BigDecimal ipi,
        BigDecimal st,
        Boolean difal,
        Long margemId,
        BigDecimal tempoEntrega
) {}
