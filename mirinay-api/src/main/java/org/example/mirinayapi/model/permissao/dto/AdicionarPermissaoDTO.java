package org.example.mirinayapi.model.permissao.dto;

import org.example.mirinayapi.model.permissao.AcaoPermissao;

import java.util.List;

public record AdicionarPermissaoDTO (
    String modulo,
    List<AcaoPermissao> acoes
        ){}
