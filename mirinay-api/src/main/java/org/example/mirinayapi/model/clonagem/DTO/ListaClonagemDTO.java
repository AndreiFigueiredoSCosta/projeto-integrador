package org.example.mirinayapi.model.clonagem.DTO;

import lombok.Builder;

@Builder
public record ListaClonagemDTO(
        Long clonagemId,
        String nome,
        Boolean status) {

}
