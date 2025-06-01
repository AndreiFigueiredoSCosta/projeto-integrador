package org.example.mirinayapi.service.cotacao.estagios;

import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.DTO.*;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.*;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.itemRequisicao.repositories.ItemRequisicaoRepository;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.model.requisicao.repositories.RequisicaoRepository;
import org.example.mirinayapi.service.*;
import org.example.mirinayapi.service.cotacao.utils.CotacaoUtils;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CotacaoAprovacaoService {
    private final CotacaoRepository cotacaoRepository;
    private final RequisicaoRepository requisicaoRepository;
    private final ItemRequisicaoRepository itemRequisicaorepository;
    private final RequisicaoService requisicaoService;
    private final CotacaoUtils cotacaoUtils;

    public List<ListagemItensAprovacaoDTO> getItensAprovacaoPorRequisicao(Long requisicaoId) {

        Requisicao requisicao = requisicaoRepository.findById(requisicaoId)
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada"));
        if (requisicao.getEstagio() != EstagioEnum.APROVACAO) {
            throw new RuntimeException("Requisição não está em aprovação");
        }

        List<ItemRequisicao> itemRequisicaos = itemRequisicaorepository.findAllByRequisicaoIdAndStatusIsTrue(requisicaoId);

        if (itemRequisicaos == null || itemRequisicaos.isEmpty()) {
            throw new RuntimeException("Nenhum item encontrado para a requisição especificada.");
        }

        return itemRequisicaos.stream().map(
                itemRequisicao -> new ListagemItensAprovacaoDTO(
                        itemRequisicao.getItemRequisicaoId(),
                        itemRequisicao.getSimilar().getProduto().getNome(),
                        itemRequisicao.getEstadoItem().toString(),
                        itemRequisicao.getQuantidade()
                )
        ).collect(Collectors.toList());
    }

    public List<ListagemFornecedoresAprovacaoDTO> getFornecedoresItensAprovacao(Long requisicaoId, Long itemId)
    {
        Requisicao requisicao = requisicaoRepository.findById(requisicaoId)
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada"));
        if (requisicao.getEstagio() != EstagioEnum.APROVACAO) {
            throw new RuntimeException("Requisição não está em aprovação");
        }

        ItemRequisicao itemRequisicao = itemRequisicaorepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        List<Cotacao> cotacaos = cotacaoRepository.findAllByItemRequisicaoId(itemId);

        if (cotacaos == null || cotacaos.isEmpty()) {
            throw new RuntimeException("Nenhuma cotação encontrada para o item especificado.");
        }

        return cotacaos.stream().map(
                cotacao -> new ListagemFornecedoresAprovacaoDTO(
                        cotacao.getFornecedorCnpj().getFornecedorCnpjId(),
                        cotacao.getFornecedorCnpj().getNome(),
                        cotacao.getItemRequisicao().getEstadoItem(),
                        cotacao.getQuantidade(),
                        cotacao.getValorUnitario().doubleValue(),
                        new DetalhesCotacaoAprovacao(
                                cotacao.getValorUnitario(),
                                cotacao.getItemRequisicao().getSimilar().getMarca().getNome(),
                                cotacao.getTempoEntrega(),
                                cotacao.getItemRequisicao().getRequisicao().getObservacao()
                        )
                )
        ).collect(Collectors.toList());
    }

    public Requisicao aprovarRequisicao(Long requisicaoId){

        Requisicao requisicao = requisicaoRepository.findById(requisicaoId)
                .orElseThrow(() -> new RuntimeException("Requisição não encontrada"));

        if (requisicao.getEstagio() != EstagioEnum.APROVACAO) {
            throw new RuntimeException("Requisição não está em aprovação");
        }
        if (requisicao.getDestino() == DestinoEnum.VENDA) {
            throw new RuntimeException("Requisição não pode ser aprovada pois é de venda");
        }

        List<ItemRequisicao> itemRequisicaos = itemRequisicaorepository.findAllByRequisicaoIdAndStatusIsTrue(requisicaoId);

        if (itemRequisicaos == null || itemRequisicaos.isEmpty()) {
            throw new RuntimeException("Nenhum item encontrado para a requisição especificada.");
        }

//        for (ItemRequisicao itemRequisicao : itemRequisicaos) {
//            itemRequisicaos.forEach(itemRequisicao1 -> {
//                itemRequisicao1.setEstadoItem(EstadoItemEnum.APROVADO);
//                itemRequisicaorepository.save(itemRequisicao1);
//            });
//        }

        requisicao.setEstagio(EstagioEnum.CONCLUIDO);
        return requisicaoRepository.save(requisicao);

    }

    public Requisicao classificarFornecedor(Long cotacaoId, Long fornecedorId, Double classificacao) {
        return null;
    }

    //Aprovacao
    public void alterarEstadoCotacao( Long requisicaoId, Long cotacaoId, EstadoDTO estado) throws BadRequestException {
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);
        Cotacao cotacao = cotacaoUtils.assertCotacao(cotacaoId);

        if (requisicao.getEstagio() != EstagioEnum.APROVACAO) {
            throw new RuntimeException("Requisição não está em aprovação");
        }

        ItemRequisicao itemRequisicao = cotacao.getItemRequisicao();

        itemRequisicao.setEstadoItem(estado.estado());

        itemRequisicaorepository.save(itemRequisicao);
    }
}
