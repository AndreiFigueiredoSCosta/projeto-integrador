package org.example.mirinayapi.model.subgrupo.dto;

import org.example.mirinayapi.model.produto.DTO.ProdutosDTO;

import java.util.List;

public record SGProdutosDTO(Long id, String nome, String descricao, List<ProdutosDTO> produtos) {
    public SGProdutosDTO(Long id, String nome, String descricao) {
        this(id, nome, descricao, List.of());
    }
}
