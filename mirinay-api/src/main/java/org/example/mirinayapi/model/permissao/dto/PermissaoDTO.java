package org.example.mirinayapi.model.permissao.dto;


import org.example.mirinayapi.model.permissao.AcaoPermissao;

import java.util.List;

public record PermissaoDTO(
        Long id,
        String modulo,
        List<AcaoPermissao> acoes

) {
}
