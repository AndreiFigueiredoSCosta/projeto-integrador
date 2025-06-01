package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

public record ListagemFornecedoresRevisaoDTO(
        Long fornecedorId,
        String nomeFornecedor,
        String cnpj,
        String observacao
) {
}
