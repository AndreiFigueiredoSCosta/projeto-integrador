package org.example.mirinayapi.model.requisicao.DTO;

import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;
import org.example.mirinayapi.model.unidade.Unidade;

public record CadastrarRequisicaoDTO(String nome, String cliente, String observacao, String destino, String prioridade, Long unidadeId) {
}
