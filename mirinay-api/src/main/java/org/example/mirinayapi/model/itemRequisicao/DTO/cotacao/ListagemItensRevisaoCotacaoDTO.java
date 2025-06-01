package org.example.mirinayapi.model.itemRequisicao.DTO.cotacao;

import lombok.Builder;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;

@Builder
public record ListagemItensRevisaoCotacaoDTO(
        Long itemId,
        Long produtoId,
        Long similarId,
        Boolean encontrado,
        String referencia,
        String nomeProduto,
        String grupo,
        String subgrupo,
        Integer quantidade,
        String observacao,
        DestinoEnum destino,
        EstadoItemEnum estado
) {
}
