package org.example.mirinayapi.model.permissao.dto;

public record AssociarPermissaoUsuarioDTO(
        Long idUsuario,
        Long idAutorizacao
) {
}
