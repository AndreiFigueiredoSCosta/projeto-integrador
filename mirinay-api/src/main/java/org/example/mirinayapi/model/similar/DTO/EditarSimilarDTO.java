package org.example.mirinayapi.model.similar.DTO;

import org.example.mirinayapi.model.similar.Similar;

public record EditarSimilarDTO(
        Long idSimilar,
        String codigoReferencia,
        String aplicacao,
        Integer quantidadeEstoque,
        Long idMarca
 ) {
    public EditarSimilarDTO(Similar similar){
        this(similar.getSimilarId(),
                similar.getReferencia(),
                similar.getObservacao(),
                similar.getQuantidadeEstoque(),
                similar.getMarca().getId());
    }
}
