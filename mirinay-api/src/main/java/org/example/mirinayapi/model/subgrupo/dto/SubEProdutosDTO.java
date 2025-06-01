package org.example.mirinayapi.model.subgrupo.dto;

import org.example.mirinayapi.model.produto.DTO.ProdutoSimplesDTO;

import java.util.List;

public record SubEProdutosDTO(Long id, String nome, String descricao, List<ProdutoSimplesDTO> produtos) {
    public SubEProdutosDTO(Long id,String nome, String descricao) {
        this(id, nome, descricao, List.of());
    }
}
