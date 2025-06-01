package org.example.mirinayapi.model.itemRequisicao.DTO.aprovacao;

public record ListagemItensRequisicaoAprovacaoDTO(
        Long itemId,
        String nome,
        Boolean encontrado,
        org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum estado,
        DetalhesAprovacao detalhes
) {
}
