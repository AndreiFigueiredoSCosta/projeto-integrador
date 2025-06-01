package org.example.mirinayapi.model.grupo.dto;

import org.example.mirinayapi.model.subgrupo.dto.SGProdutosDTO;
import org.example.mirinayapi.model.subgrupo.dto.SubGrupoDTO;

import java.util.ArrayList;
import java.util.List;

public record GruposProdutosDTO(
        Long id,
        String nome,
        String descricao,
        List<SGProdutosDTO> subgrupo
) {
    public GruposProdutosDTO(Long id, String nome, String descricao) {
        this(id, nome, descricao, new ArrayList<>());
    }
}