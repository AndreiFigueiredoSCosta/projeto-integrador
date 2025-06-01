package org.example.mirinayapi.model.cotacao.DTO.cotacao;

import lombok.Builder;

@Builder
public record GetCotacaoFornecedorDTO(
        Long cnpjId,
        String nomeFornecedor,
        String observacao
) {}
