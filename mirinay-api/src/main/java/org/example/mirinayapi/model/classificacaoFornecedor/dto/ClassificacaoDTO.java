package org.example.mirinayapi.model.classificacaoFornecedor.dto;

public record ClassificacaoDTO(
        Long itemId,
        int valorClassificacao,
        String motivo,
        Long fornecedorId
) {
}
