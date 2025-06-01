package org.example.mirinayapi.service.cotacao;

import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.DTO.*;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoFornecedorDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoFornecedorItemDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoItemCotacaoDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoItemDTO;
import org.example.mirinayapi.model.cotacao.DTO.revisao.ListagemRevisaoFornecedorDTO;
import org.example.mirinayapi.model.cotacao.DTO.revisao.ListagemRevisaoProdutoCotacoesDTO;
import org.example.mirinayapi.model.cotacao.DTO.revisao.RevisaoInsertCNPJDTO;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.itemRequisicao.DTO.EditarItemRequisicaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.InserirItemEmFaseCotacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.*;
import org.example.mirinayapi.model.misc.DeleteDTO;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.model.requisicao.repositories.RequisicaoRepository;
import org.example.mirinayapi.service.cotacao.estagios.CotacaoAprovacaoService;
import org.example.mirinayapi.service.cotacao.estagios.CotacaoConcluidoService;
import org.example.mirinayapi.service.cotacao.estagios.CotacaoCotacaoService;
import org.example.mirinayapi.service.cotacao.estagios.CotacaoRevisaoService;
import org.example.mirinayapi.service.cotacao.utils.CotacaoUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CotacaoService {
    private final RequisicaoRepository requisicaoRepository;
    private final CotacaoRevisaoService revisaoService;
    private final CotacaoCotacaoService cotacaoService;
    private final CotacaoAprovacaoService aprovacaoService;
    private final CotacaoConcluidoService concluidoService;
    private final CotacaoUtils cotacaoUtils;

    // ------------------------- Sumário --------------------------

    // Função para listar as cotações em andamento
    public List<ListagemCotacao> getRequisicoesEmEstadoCotacao() {
       List<Requisicao> requisicao = requisicaoRepository.findAllByEstagios(Arrays.asList(
                EstagioEnum.COTACAO,
                EstagioEnum.REVISAO,
                EstagioEnum.APROVACAO
       ));
         return requisicao.stream().map(
                 requisicao1 -> new ListagemCotacao(
                         requisicao1.getRequisicaoId(),
                            requisicao1.getNome(),
                            Math.toIntExact(requisicao1.getUsuario().getId()),
                            requisicao1.getPrioridade(),
                            requisicao1.getEstagio()
                 )
         ).collect(Collectors.toList());
    }

    // Função para listar as cotações concluídas
    public List<ListagemCotacaoConcluidas> getRequisicoesConcluidas(Pageable pageable) {

        return requisicaoRepository.findAllConcluded(pageable).stream().map(
                requisicao -> new ListagemCotacaoConcluidas(
                        requisicao.getRequisicaoId(),
                        requisicao.getNome(),
                        Math.toIntExact(requisicao.getUsuario().getId()),
                        requisicao.getEstagio().compareTo(EstagioEnum.APROVACAO) == 0,
                        requisicao.getDestino()
                )
        ).collect(Collectors.toList());
    }

    // ------------------- Estágio de Revisão -------------------

    // ----------------------------- GET -----------------------------

    public List<ListagemRevisaoFornecedorDTO> getRevisaoFornecedor(Long requisicaoId) throws BadRequestException {
        return revisaoService.getRevisaoFornecedor(requisicaoId);
    }

    public List<ListagemItensRevisaoCotacaoDTO> getRevisaoItem(Long cotacaoId) {
        return revisaoService.getRevisaoItem(cotacaoId);
    }

    public List<ListagemSimilaresRevisaoCotacaoDTO> getRevisaoItemSimilar(Long itemId) {
        return revisaoService.getRevisaoItemSimilar(itemId);
    }

    public List<ListagemFornecedoresRevisaoDTO> getFornecedoresCotacao(Long requisicaoId) {
        return revisaoService.getFornecedoresCotacao(requisicaoId);
    }

    public List<Long> getRevisaoIdsCNPJs(Long requisicaoId, Long fornecedorId) {
        return revisaoService.getRevisaoIdsCNPJs(requisicaoId, fornecedorId);
    }

    public List<ListagemRevisaoProdutoCotacoesDTO> getRevisaoItemCotacao(Long itemId) throws BadRequestException {
       return revisaoService.getRevisaoItemCotacao(itemId);
    }

    // ------------------- Revisão - PATCH -------------------

    public ResponseEntity<?> patchRevisaoSelecionarSimilar(Long itemId, Long similarId) {
       return revisaoService.patchRevisaoSelecionarSimilar(itemId, similarId);
    }

    public ResponseEntity<?> patchRevisaoCotacaoAlterarCNPJ(Long cotacaoId, Long cnpjId) throws BadRequestException {
        return revisaoService.patchRevisaoCotacaoAlterarCNPJ(cotacaoId, cnpjId);
    }

    // ------------------- Revisão - POST -------------------

    public ResponseEntity<?> postRevisaoCotarClonagem(Long itemId, Long clonagemId, Long requisicaoId) throws BadRequestException {
        return revisaoService.postRevisaoCotarClonagem(itemId, clonagemId, requisicaoId);
    }

    public ResponseEntity<?> postRevisaoCotarCNPJsParaTodos(Long requisicaoId, RevisaoInsertCNPJDTO cnpjIds) throws BadRequestException {
        return revisaoService.postRevisaoCotarCNPJsParaTodos(requisicaoId, cnpjIds);
    }

    public ResponseEntity<?> postRevisaoCadastrarNovoProduto(PostCotacaoRevisaoProdutoSimilarDTO item) throws BadRequestException {
        return revisaoService.postRevisaoCadastrarNovoProduto(item);
    }

    public ResponseEntity<?> postRevisaoCadastrarNovoSimilar(PostRevisaoCadastrarSimilarDTO similar) throws BadRequestException {
        return revisaoService.postRevisaoCadastrarNovoSimilar(similar);
    }

    public ResponseEntity<?> postRevisaoInserirItem(Long requisicaoId, InserirItemEmFaseCotacaoDTO item) throws BadRequestException {
        return revisaoService.postRevisaoInserirItem(requisicaoId, item);
    }

    // ------------------- Revisão - PUT -------------------

    public ResponseEntity<?> putRevisaoEditarItem(EditarItemRequisicaoDTO editarItemRequisicaoDTO, Long requisicaoId) throws BadRequestException {
        return revisaoService.putRevisaoEditarItem(editarItemRequisicaoDTO, requisicaoId);
    }

    // ------------------- Revisão - DELETE -------------------

    public ResponseEntity<?> deleteRevisaoItem(DeleteDTO deleteDTO) throws BadRequestException {
        System.out.println("Vai deletar o item");
        return revisaoService.deleteRevisaoItem(deleteDTO);
    }

    public ResponseEntity<?> deleteRevisaoItemCotacao(DeleteDTO deleteDTO) throws BadRequestException {
        return revisaoService.deleteRevisaoItemCotacao(deleteDTO);
    }

    public ResponseEntity<?> deleteRevisaoCNPJ(Long requisicaoId, DeleteDTO deleteDTO) throws BadRequestException {
        return revisaoService.deleteRevisaoCNPJ(requisicaoId, deleteDTO);
    }

    // ------------------- Estágio de Cotação -------------------

    // --------------------- Cotação - GET ----------------------

    public List<GetCotacaoFornecedorItemDTO> getCotacaoFornecedorItem(Long requisicaoId, Long cnpjId) throws BadRequestException {
        return cotacaoService.getCotacaoFornecedorItem(requisicaoId, cnpjId);
    }
    public List<GetCotacaoFornecedorDTO> getCotacaoFornecedor(Long requisicaoId) throws BadRequestException {
        return cotacaoService.getCotacaoFornecedor(requisicaoId);
    }
    public List<GetCotacaoItemCotacaoDTO> getCotacaoItemCotacao(Long itemId) throws BadRequestException {
        return cotacaoService.getCotacaoItemCotacao(itemId);
    }
    public List<GetCotacaoItemDTO> getCotacaoItem(Long requisicaoId) throws BadRequestException {
        return cotacaoService.getCotacaoItem(requisicaoId);
    }



    // --------------------- Cotação - PUT ---------------------

    public ResponseEntity<?> putCotacaoCotar(Long requisicaoId, Long cotacaoId, PutCotacaoCotarFornecedorDTO cotacao) throws BadRequestException {
        return cotacaoService.putCotacaoCotar(requisicaoId, cotacaoId, cotacao);
    }

    // ------------------- Estágio de Aprovação -------------------

    // --------------------- Aprovação - GET ---------------------
    public List<ListagemFornecedoresAprovacaoDTO> getFornecedoresItensAprovacao(Long id, Long itemId) {
        return aprovacaoService.getFornecedoresItensAprovacao(id, itemId);
    }

    public List<ListagemItensAprovacaoDTO> getItensAprovacaoPorRequisicao(Long id) {
        return aprovacaoService.getItensAprovacaoPorRequisicao(id);
    }
    // --------------------- Aprovação - PATCH -------------------
    public Requisicao classificarFornecedor(Long id, Long fornecedorId, Double classificacao) {
        return aprovacaoService.classificarFornecedor(id, fornecedorId, classificacao);
    }

    public void alterarEstadoCotacao(Long id, Long cotacaoId, EstadoDTO estado) throws BadRequestException {
        aprovacaoService.alterarEstadoCotacao(id, cotacaoId, estado);
    }

    public Requisicao aprovarRequisicao(Long id) {
        return aprovacaoService.aprovarRequisicao(id);
    }

    // ------------------- Estágio de Conclusão -------------------

    // ------------------- Conclusão - GET -----------------------
    // ------------------- Conclusão - PATCH ---------------------
    // ------------------- Conclusão - POST ----------------------
    // ------------------- Conclusão - PUT -----------------------
    // ------------------- Conclusão - DELETE --------------------


    // ------------------- Utils -------------------

    public Cotacao assertCotacao(Long cotacaoId) throws BadRequestException {
        return cotacaoUtils.assertCotacao(cotacaoId);
    }

    public Cotacao saveCotacao(Cotacao cotacao) {
        return cotacaoUtils.saveCotacao(cotacao);
    }

    public ResponseEntity<?> postRevisaoCotarCNPJs(Long requisicaoId, RevisaoInsertCNPJDTO insertCNPJDTO, Long itemId) throws BadRequestException {
        return revisaoService.postRevisaoCotarCNPJs(requisicaoId, insertCNPJDTO, itemId);
    }

    public ResponseEntity<?> patchRevisaoAlterarReferencia(Long itemId, Long similarId, Long requisicaoId) throws BadRequestException {
        return revisaoService.patchRevisaoAlterarReferencia(itemId, similarId, requisicaoId);
    }

    public ResponseEntity<?> patchDetalhesAlterarEstagio(Long requisicaoId, EstagioEnum estagio) throws BadRequestException {
        return cotacaoUtils.patchDetalhesAlterarEstagio(requisicaoId, estagio);
    }
}
