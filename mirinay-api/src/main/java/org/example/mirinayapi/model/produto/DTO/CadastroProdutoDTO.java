package org.example.mirinayapi.model.produto.DTO;


import lombok.Builder;

@Builder
public record CadastroProdutoDTO(
        String nome,
        String descricao,
        Long subgrupoId,
        Long unidadeId
        ) {


}