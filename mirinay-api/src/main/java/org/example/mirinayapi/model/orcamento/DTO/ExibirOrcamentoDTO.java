package org.example.mirinayapi.model.orcamento.DTO;


import lombok.Builder;
import org.example.mirinayapi.model.orcamentoSimilar.DTO.ListagemOrcamentoSimilarDTO;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Builder
public record ExibirOrcamentoDTO(
        Long orcamentoId,
        String vendedor,
        String cliente,
        BigDecimal valorTotal,
        Date data,
        List<ListagemOrcamentoSimilarDTO> produtos
) {
}
