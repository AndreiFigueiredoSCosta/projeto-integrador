package org.example.mirinayapi.model.pedidos.DTO;

import javax.xml.crypto.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public record GerarDTO(
        Long fornecedorId,
        Date prevEntrega,
        Long unidadeId,
        Long freteId,
        Long condPgtoId,
        Long transportadorId,

        List<Long> cotacaoIds
) {
}
