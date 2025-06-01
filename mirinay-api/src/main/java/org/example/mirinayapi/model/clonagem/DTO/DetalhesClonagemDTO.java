package org.example.mirinayapi.model.clonagem.DTO;

import lombok.Builder;

@Builder
public record DetalhesClonagemDTO(
        Long clonagemId,
        String nome,
        Boolean status,
        String fornecedorNome,
        Long produtoFornecedorId
) {
}
