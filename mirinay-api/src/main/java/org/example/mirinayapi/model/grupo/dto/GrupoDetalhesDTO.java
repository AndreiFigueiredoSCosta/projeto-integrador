package org.example.mirinayapi.model.grupo.dto;

import org.example.mirinayapi.model.subgrupo.dto.SubGrupoDTO;

import java.util.List;

public record GrupoDetalhesDTO(Long id, String nome, String descricao, Integer quantidadeSubgrupos) {

}
