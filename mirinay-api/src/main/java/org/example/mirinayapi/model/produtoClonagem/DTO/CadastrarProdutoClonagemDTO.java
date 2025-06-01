package org.example.mirinayapi.model.produtoClonagem.DTO;

import java.util.List;

public record CadastrarProdutoClonagemDTO(
        Long clonagemId,
        List<Long> similares
) {




}
