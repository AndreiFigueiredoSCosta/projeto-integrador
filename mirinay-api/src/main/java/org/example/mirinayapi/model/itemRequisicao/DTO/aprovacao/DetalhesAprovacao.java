package org.example.mirinayapi.model.itemRequisicao.DTO.aprovacao;

import java.math.BigDecimal;

public record DetalhesAprovacao(
        String marca,
        BigDecimal valor,
        Integer quantidade,
        BigDecimal tempoEntrega
        ) {
}
