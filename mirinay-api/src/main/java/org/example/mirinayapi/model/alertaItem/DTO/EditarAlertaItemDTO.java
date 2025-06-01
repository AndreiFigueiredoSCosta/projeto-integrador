package org.example.mirinayapi.model.alertaItem.DTO;

import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;

public record EditarAlertaItemDTO(Long alertaItemId, String descricao, ItemRequisicao itemRequisicao) {
}
