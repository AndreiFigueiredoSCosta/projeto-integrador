package org.example.mirinayapi.service;

import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.alertaItem.AlertaItem;
import org.example.mirinayapi.model.alertaItem.DTO.GetAlertaItemDTO;
import org.example.mirinayapi.model.alertaItem.repositories.AlertaItemRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertaItemService {
    private final AlertaItemRepository repository;
    private final ItemRequisicaoService itemRequisicaoService;

    public AlertaItemService(AlertaItemRepository repository, @Lazy ItemRequisicaoService itemRequisicaoService) {
        this.repository = repository;
        this.itemRequisicaoService = itemRequisicaoService;
    }

    public ResponseEntity<?> saveAlertaItem(AlertaItem alertaItem) throws BadRequestException {
        itemRequisicaoService.assertItemRequisicao(alertaItem.getItemRequisicao().getItemRequisicaoId());
        this.repository.save(alertaItem);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> deleteAlertaItem(Long alertaId) {
        this.repository.deleteById(alertaId);
        return ResponseEntity.noContent().build();
    }

    public List<GetAlertaItemDTO> getAlertaItem(Long itemId) throws BadRequestException {
        itemRequisicaoService.assertItemRequisicao(itemId);

        List<AlertaItem> alertaItems = this.repository.findByItemRequisicaoId(itemId);

        return alertaItems.stream().map(alertaItem ->
                GetAlertaItemDTO.builder()
                        .alertaId(alertaItem.getAlertaItemId())
                        .itemId(alertaItem.getItemRequisicao().getItemRequisicaoId())
                        .alerta(alertaItem.getDescricao())
                        .build()
        ).toList();
    }

    public AlertaItem assertAlertaItem(Long alertaId) throws BadRequestException {
        return this.repository.findById(alertaId).orElseThrow(() -> new BadRequestException("Alerta não encontrado"));
    }
}
