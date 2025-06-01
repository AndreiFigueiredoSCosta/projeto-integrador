package org.example.mirinayapi.model.requisicao.DTO;

import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;

import java.util.List;

public record RequisicaoUnificacaoDTO(
        String nome,
        Long solicitanteId,
        Long unidadeId,
        PrioridadeEnum prioridade,
        String observacao,
        List<Long> itens
) {

}

