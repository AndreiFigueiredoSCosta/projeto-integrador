package org.example.mirinayapi.model.produto.DTO;

import org.example.mirinayapi.model.similar.DTO.SimilarDTO;

import java.util.List;

public record ProdutosDTO(
        Long id,
        String descricao,
        List<SimilarDTO> similares
) {
    public ProdutosDTO(Long id, String descricao) {
        this(id, descricao, List.of());
    }

}
