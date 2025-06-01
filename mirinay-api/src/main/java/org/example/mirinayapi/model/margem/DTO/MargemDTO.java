package org.example.mirinayapi.model.margem.DTO;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record MargemDTO(
        Long margemId,
        String nome,
        BigDecimal valor
) {
}
