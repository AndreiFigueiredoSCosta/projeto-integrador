package org.example.mirinayapi.model.cotacao.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public record ListagemFornecedoresCotacaoDTO(
        Long cotacaoId,
        Long fornecedorId,
        String nomeFornecedor,
        BigDecimal ultimoPreco,
        Date dataUltimoPreco,
        Integer quantidade,
        DetalhesCotacao detalhes
) {
}
