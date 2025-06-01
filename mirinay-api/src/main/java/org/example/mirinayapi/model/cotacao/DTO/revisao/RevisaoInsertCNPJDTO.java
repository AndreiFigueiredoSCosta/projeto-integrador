package org.example.mirinayapi.model.cotacao.DTO.revisao;

import java.util.List;

public record RevisaoInsertCNPJDTO(
        List<Long> cnpjIds,
        Long fornecedorId
) {}
