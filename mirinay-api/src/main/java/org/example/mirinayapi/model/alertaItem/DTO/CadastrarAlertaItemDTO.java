package org.example.mirinayapi.model.alertaItem.DTO;

import lombok.Builder;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;

@Builder
public record CadastrarAlertaItemDTO(
        String alerta,
        ItemRequisicao itemRequisicao
) {
}
