package org.example.mirinayapi.model.produtoFornecedor.DTO;

import lombok.Builder;

@Builder
public record ListagemGrupoProdutoFornecedor(Long codigo, String similar, String fornecedor, String clonagem) {
}
