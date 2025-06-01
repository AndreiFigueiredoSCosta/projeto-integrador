package org.example.mirinayapi.model.cotacao.DTO.cotacao;

import lombok.Builder;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.margem.DTO.MargemDTO;

import java.math.BigDecimal;
import java.util.Date;

@Builder
public record GetCotacaoFornecedorItemDTO(
        Long cotacaoId,
        Integer quantidadeItem,
        Integer quantidadeCotada,
        EstadoItemEnum estado,
        String marca,
        String referencia,
        BigDecimal precoUnit,
        BigDecimal ipi,
        BigDecimal st,
        Boolean difal,
        MargemDTO margem,

        // Último preco cotado nosúltimos 6 meses
        Date dataUltimaCotacao,
        BigDecimal precoUltimaCotacao
) {}
