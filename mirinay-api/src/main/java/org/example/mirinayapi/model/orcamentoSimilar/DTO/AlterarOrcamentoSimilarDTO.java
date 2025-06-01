package org.example.mirinayapi.model.orcamentoSimilar.DTO;

public record AlterarOrcamentoSimilarDTO(
        Integer quantidade,
        String tipoDeMaquina,
        String marcaDaMaquina,
        Long idCotacao
) {
}
