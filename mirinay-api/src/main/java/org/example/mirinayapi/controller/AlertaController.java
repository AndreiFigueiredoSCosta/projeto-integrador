package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.alertaItem.AlertaItem;
import org.example.mirinayapi.model.alertaItem.DTO.GetAlertaItemDTO;
import org.example.mirinayapi.service.AlertaItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerta")
@CrossOrigin(origins = "*")
public class AlertaController {

    private final AlertaItemService service;

    public AlertaController(AlertaItemService service) {
        this.service = service;
    }

    @PostMapping("/item/cadastrar")
    @Transactional
    public ResponseEntity<?> postAlertaItem(@Valid @RequestBody AlertaItem alertaItem) throws BadRequestException {
        return this.service.saveAlertaItem(alertaItem);
    }

    @DeleteMapping("/item/deletar/{alertaId}")
    @Transactional
    public ResponseEntity<?> deleteAlertaItem(@PathVariable Long alertaId) {
        return this.service.deleteAlertaItem(alertaId);
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<GetAlertaItemDTO>> getAlertaItem(
            @PathVariable Long itemId
    ) throws BadRequestException {
        return ResponseEntity.ok(this.service.getAlertaItem(itemId));
    }
}
