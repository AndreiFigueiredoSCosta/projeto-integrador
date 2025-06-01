package org.example.mirinayapi.model.misc;

import lombok.Builder;

@Builder
public record DeleteDTO(
        Long idToDelete,
        String motivo
) {
}
