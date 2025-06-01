package org.example.mirinayapi.model.similar.DTO;

import lombok.Builder;

@Builder
public record SubmitSimilarDTO(
        Long similarId,
        String referencia,
        String observacao,
        Long idMarca
 ) {}
