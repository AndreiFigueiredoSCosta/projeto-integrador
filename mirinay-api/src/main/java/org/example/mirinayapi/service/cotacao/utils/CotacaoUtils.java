package org.example.mirinayapi.service.cotacao.utils;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.service.RequisicaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
@AllArgsConstructor
public class CotacaoUtils {
    private final CotacaoRepository cotacaoRepository;
    private final RequisicaoService requisicaoService;

    public Cotacao assertCotacao(Long cotacaoId) throws BadRequestException{
        Optional<Cotacao> cotacao = cotacaoRepository.findById(cotacaoId); // Não possui coluna Status
        if (cotacao.isEmpty()){
            throw new BadRequestException("Cotação não encontrada");
        }

        return cotacao.get();
    }

    public Cotacao saveCotacao(@Valid Cotacao cotacao){
        return cotacaoRepository.save(cotacao);
    }

    public ResponseEntity<?> patchDetalhesAlterarEstagio(Long requisicaoId, EstagioEnum estagio) throws BadRequestException {
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);

        switch (requisicao.getEstagio()){
            case REVISAO:
                if (estagio == EstagioEnum.COTACAO){
                    assertRevisaoToCotacaoTrade(requisicao);
                    requisicao.setEstagio(estagio);
                } else {
                    return ResponseEntity.badRequest().body("Estágio atual não permite alteração para o estágio desejado");
                }
                break;
            case COTACAO:
                switch (estagio){
                    case REVISAO:
                        requisicao.setEstagio(estagio);
                        break;
                    case APROVACAO:
                        assertCotacaoToAprovacaoTrade(requisicao);
                        cleanCotacoes(requisicao);
                        requisicao.setEstagio(estagio);
                        break;
                    default:
                        return ResponseEntity.badRequest().body("Estágio atual não permite alteração para o estágio desejado");
                }
                break;
            case APROVACAO:

                break;
            default:
                return ResponseEntity.badRequest().body("Estágio atual não permite alteração");
        }

        return ResponseEntity.ok("Estágio alterado com sucesso");
    }

    private void assertRevisaoToCotacaoTrade(Requisicao requisicao) throws BadRequestException {
        List<ItemRequisicao> irsSemCotacao = new ArrayList<>();
        List<ItemRequisicao> irsNaoEncontrado = new ArrayList<>();

        requisicao.getItensRequisicao().forEach(item -> {
            if (item.getEncontrado()){
                irsNaoEncontrado.add(item);
            }
            else if (item.getCotacoes().isEmpty()){
                irsSemCotacao.add(item);
            }
        });

        if (!irsSemCotacao.isEmpty()){
            StringBuilder msg = new StringBuilder("Os itens seguintes não possuem cotação: ");
            for (ItemRequisicao item : irsSemCotacao){
                msg.append("(QTD: ").append(item.getQuantidade()).append(")").append(item.getSimilar().getReferencia()).append(";\n");
            }

            throw new BadRequestException(msg.toString());
        }

        if (!irsNaoEncontrado.isEmpty()){
            StringBuilder msg = new StringBuilder("Os itens seguintes não foram encontrados: ");
            for (ItemRequisicao item : irsNaoEncontrado){
                msg.append("(QTD: ").append(item.getQuantidade()).append(")").append(item.getSimilar().getReferencia()).append(";\n");
            }

            throw new BadRequestException(msg.toString());
        }
    }

    private void assertCotacaoToAprovacaoTrade(Requisicao requisicao) throws BadRequestException {
        List<ItemRequisicao> irsNaoSatisfeitos = new ArrayList<>();

        requisicao.getItensRequisicao().forEach(item -> {
            if (!item.getEstadoItem().equals(EstadoItemEnum.DESCLASSIFICADO)) {
                AtomicReference<Integer> itemQtd = new AtomicReference<>(item.getQuantidade());
                item.getCotacoes().forEach(cotacao -> {
                    if (cotacao.getEstadoCotacao().equals(EstadoItemEnum.PREAPROVADO)) {
                        itemQtd.updateAndGet(v -> v - cotacao.getQuantidade());
                    }
                });

                if (itemQtd.get() > 0) {
                    irsNaoSatisfeitos.add(item);
                }
            }
        });

        if (!irsNaoSatisfeitos.isEmpty()){
            StringBuilder msg = new StringBuilder("Os itens seguintes não possuem quantidade suficientemente cotada: ");
            for (ItemRequisicao item : irsNaoSatisfeitos){
                msg.append("(QTD: ").append(item.getQuantidade()).append(")").append(item.getSimilar().getReferencia()).append(";\n");
            }

            throw new BadRequestException(msg.toString());
        }
    }

    private void cleanCotacoes(Requisicao requisicao){
        requisicao.getItensRequisicao().forEach(item -> {
            item.getCotacoes().forEach(cotacao -> {
                if(!cotacao.getEstadoCotacao().equals(EstadoItemEnum.PREAPROVADO)){
                    cotacaoRepository.delete(cotacao);
                }
            });
        });
    }
}
