package org.example.mirinayapi.model.cotacao.DTO.cotacao;

import lombok.Builder;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.margem.DTO.MargemDTO;

import java.math.BigDecimal;
import java.util.Date;

@Builder
public record GetCotacaoItemCotacaoDTO(
        Long cotacaoId,
        String nomeFornecedor,
        Integer quantidade,
        BigDecimal precoUnit,
        EstadoItemEnum estado,
        String observacao,
        BigDecimal ipi,
        BigDecimal st,
        Boolean difal,
        MargemDTO margem,

        // Referente ao último preco cotado em até 6 meses
        BigDecimal precoUltimaCotacao,
        Date dataUltimaCotacao
) {}