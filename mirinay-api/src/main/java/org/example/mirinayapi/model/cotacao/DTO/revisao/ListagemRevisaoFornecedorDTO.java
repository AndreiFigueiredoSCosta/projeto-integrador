package org.example.mirinayapi.model.cotacao.DTO.revisao;

import lombok.Builder;

@Builder
public record ListagemRevisaoFornecedorDTO(
        Long fornecedorId,
        Long cnpjId,
        String nomeFantasia,
        String cnpj,
        String observacoes
) { }
