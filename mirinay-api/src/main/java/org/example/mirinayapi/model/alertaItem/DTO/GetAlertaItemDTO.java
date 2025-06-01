package org.example.mirinayapi.model.alertaItem.DTO;

import lombok.Builder;

@Builder
public record GetAlertaItemDTO (
        Long alertaId,
        Long itemId,
        String alerta
){}
