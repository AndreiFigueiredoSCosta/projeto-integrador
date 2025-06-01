package org.example.mirinayapi.model.estoqueRequisicao;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EstoqueRequisicoesDTO {
    private String unidadeNome;
    private Integer quantidadeItem;
    private EstagioEnum estagioRequisicao;
    private String cliente;
}