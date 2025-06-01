package org.example.mirinayapi.model.cotacao.DTO;

import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;

import java.math.BigDecimal;
import java.util.Date;


public record ListagemFornecedoresAprovacaoDTO(
        Long fornecedorId,
        String nomeFornecedor,

        EstadoItemEnum estado,
        Integer quantidade,

        Double classificacao,
        DetalhesCotacaoAprovacao detalhes
) {
}