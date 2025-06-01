package org.example.mirinayapi.model.permissao.dto;

import java.util.List;

public record AutorizacaoDTO(
        String nome,
        String descricao,
        List<Long> permissoes

) {
}
