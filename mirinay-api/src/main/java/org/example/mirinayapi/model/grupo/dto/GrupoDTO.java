package org.example.mirinayapi.model.grupo.dto;

public record GrupoDTO(Long id, String nome, String descricao, java.util.List<org.example.mirinayapi.model.subgrupo.dto.SGProdutosDTO> margem) {
}
