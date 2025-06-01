package org.example.mirinayapi.model.cotacao.DTO.revisao;

import lombok.Builder;

@Builder
public record ListagemRevisaoProdutoCotacoesDTO(
        Long fornecedorId,
        String nomeFornecedor,
        String cnpj,
        String observacoes,
        Long cnpjId,
        Long cotacaoId
){}
