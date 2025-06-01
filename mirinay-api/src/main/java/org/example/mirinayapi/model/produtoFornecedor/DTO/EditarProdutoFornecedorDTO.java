package org.example.mirinayapi.model.produtoFornecedor.DTO;

public record EditarProdutoFornecedorDTO(
        Long codigo,
        String nome,
        Long fornecedorId,

        Long similarId,

        Long clonagemId
) {
}
