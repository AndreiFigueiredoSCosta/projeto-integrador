package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

import java.math.BigDecimal;
import java.util.Date;

public record ListagemCotacaoItensFornecedorDTO(
        Long itemID,
        String referencia,
        String nomeProduto,
        Integer quantidade,
        BigDecimal ultimoPreco,
        Date dataUltimoPreco,
        BigDecimal valorUnitario,
        String observacao
) {

}
