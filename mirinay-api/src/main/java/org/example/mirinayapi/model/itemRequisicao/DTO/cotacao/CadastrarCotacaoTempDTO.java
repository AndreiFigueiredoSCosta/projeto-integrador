package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

import java.math.BigDecimal;
import java.util.Date;

public record CadastrarCotacaoTempDTO(
        Long itemRequisicaoId,
        Long fornecedorCnpjId,
        Integer quantidade


) {


}
