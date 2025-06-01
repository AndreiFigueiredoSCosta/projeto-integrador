package org.example.mirinayapi.model.itemRequisicao.DTO.unificacao;

public record ListagemItemEstoqueUnificacaoDTO(
        Long itemId,
        Long requisicaoId,
        String nomeProduto,
        Integer quantidade,
        String grupo
        ) {}
