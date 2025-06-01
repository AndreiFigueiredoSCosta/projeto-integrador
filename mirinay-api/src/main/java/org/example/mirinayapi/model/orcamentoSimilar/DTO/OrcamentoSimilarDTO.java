package org.example.mirinayapi.model.orcamentoSimilar.DTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;


@Builder
public record OrcamentoSimilarDTO(
        @NotBlank
        Long idSimilar,
        @PositiveOrZero
        int quantidade,
        String marcaMaquina,
        String tipoDeMaquina,
        Long idCotacao
) {
}
