package org.example.mirinayapi.model.orcamento.DTO;


import lombok.Builder;


@Builder
public record ListagemOrcamentoDTO(
        Long orcamentoId,
        String vendedor,
        String cliente
) {
}
