package org.example.mirinayapi.model.grupo.dto;

import org.example.mirinayapi.model.subgrupo.dto.SubGrupoDTO;

import java.util.ArrayList;
import java.util.List;

public record ListaGruposDTO(
        Long id,
        String nome,
        String descricao,
        List<SubGrupoDTO> subgrupo
) {
    public ListaGruposDTO(Long id, String nome, String descricao) {
        this(id, nome, descricao, new ArrayList<>());
    }
}
