package org.example.mirinayapi.model.subgrupo.dto;

public record EditarSubgrupoDTO(
        Long subgrupoId,
        String nome,
        Long grupoId,
        String descricao
) {
}
