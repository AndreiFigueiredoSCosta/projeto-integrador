package org.example.mirinayapi.model.orcamento.DTO;


import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.NonNull;
import org.example.mirinayapi.model.orcamentoSimilar.DTO.OrcamentoSimilarDTO;
import java.util.Date;
import java.util.List;


@Builder
public record CadastroOrcamentoDTO(
        @NotNull
        Long vendedorId,
        @NotNull
        Long clienteId,
        @NotNull
        Date dataOrcamento,
        List<OrcamentoSimilarDTO> produtos
) {
}
