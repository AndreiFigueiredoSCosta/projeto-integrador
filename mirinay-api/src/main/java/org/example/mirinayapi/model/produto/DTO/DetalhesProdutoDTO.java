package org.example.mirinayapi.model.produto.DTO;


public record DetalhesProdutoDTO(Long idProduto,
                                 String nomeProduto,
                                 String descricao,
                                 String nomeUnidade,
                                 String nomeGrupo,
                                 String nomeSubgrupo

) {
}
