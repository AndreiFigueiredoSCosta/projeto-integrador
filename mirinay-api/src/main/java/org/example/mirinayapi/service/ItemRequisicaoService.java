package org.example.mirinayapi.service;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.alertaItem.AlertaItem;
import org.example.mirinayapi.model.alertaItem.DTO.CadastrarAlertaItemDTO;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.enums.FornecedorEnum;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.itemRequisicao.DTO.*;
import org.example.mirinayapi.model.itemRequisicao.DTO.aprovacao.ListagemItensRequisicaoAprovacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.ListagemItensCotacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.ListagemItensRevisaoCotacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.ListagemSimilaresRevisaoCotacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.unificacao.ListagemItemEstoqueUnificacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.unificacao.QuantidadeDTO;
import org.example.mirinayapi.model.misc.DeleteDTO;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.itemRequisicao.repositories.ItemRequisicaoRepository;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;
import org.example.mirinayapi.model.produtoFornecedor.repositories.ProdutoFornecedorRepository;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.model.requisicao.repositories.RequisicaoRepository;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.model.similar.repositories.ProdutoSimilarRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemRequisicaoService {
    private final ItemRequisicaoRepository repository;
    private final AlertaItemService alertaItemService;
    private final RequisicaoRepository requisicaoRepository;
    private final ProdutoSimilarRepository produtoSimilarRepository;
    private final ProdutoFornecedorRepository produtoFornecedorRepository;
    private final CotacaoRepository cotacaoRepository;
    private final SimilarService similarService;
    private final RequisicaoService requisicaoService;

    public ItemRequisicaoService(
            ItemRequisicaoRepository repository,
            @Lazy AlertaItemService alertaItemService,
            RequisicaoRepository requisicaoRepository,
            ProdutoSimilarRepository produtoSimilarRepository,
            ProdutoFornecedorRepository produtoFornecedorRepository,
            CotacaoRepository cotacaoRepository,
            @Lazy SimilarService similarService,
            @Lazy RequisicaoService requisicaoService) {
        this.repository = repository;
        this.requisicaoRepository = requisicaoRepository;
        this.produtoSimilarRepository = produtoSimilarRepository;
        this.alertaItemService = alertaItemService;
        this.produtoFornecedorRepository = produtoFornecedorRepository;
        this.cotacaoRepository = cotacaoRepository;
        this.similarService = similarService;
        this.requisicaoService = requisicaoService;
    }

    // ---------------- CONSTRUÇÃO ---------------- //

    public ResponseEntity<?> construcaoInserir (CadastrarConstrucaoDTO cadastrarConstrucaoDTO, Long id) {

        Requisicao requisicao = this.requisicaoRepository.findById(id).orElse(null);
        assert requisicao != null;
        if (requisicao.getEstagio() != EstagioEnum.CONSTRUCAO) {
            return ResponseEntity.badRequest().body("Requisição não está no estágio de construção");
        }
        ItemRequisicao itemRequisicao = new ItemRequisicao();
        Similar similar = this.produtoSimilarRepository.findSimilarByReferencia(cadastrarConstrucaoDTO.referencia());

        if (similar == null) {
            itemRequisicao.setSimilar(null);
            itemRequisicao.setEncontrado(false);
        }else {
            itemRequisicao.setSimilar(similar);
            itemRequisicao.setEncontrado(true);
        }

        itemRequisicao.setRequisicao(requisicao);
        itemRequisicao.setEstadoItem(EstadoItemEnum.COTANDO);
        itemRequisicao.setReferencia(cadastrarConstrucaoDTO.referencia());
        itemRequisicao.setQuantidade(cadastrarConstrucaoDTO.quantidade());
        itemRequisicao.setObservacao(cadastrarConstrucaoDTO.observacao());
        itemRequisicao.setDestino(cadastrarConstrucaoDTO.destino());

        switch (requisicao.getDestino()){
            case VENDA_ESTOQUE:
                break;
            case ESTOQUE, VENDA:
                if(!cadastrarConstrucaoDTO.destino().equals(requisicao.getDestino())){
                    requisicao.setDestino(DestinoEnum.VENDA_ESTOQUE);
                }
                break;
        }

        itemRequisicao.setStatus(true);


        this.repository.save(itemRequisicao);

        createInitialCotacao(itemRequisicao);
        return ResponseEntity.ok().build();
    }

    public void createInitialCotacao(ItemRequisicao itemRequisicao) {
        if (itemRequisicao.getSimilar() == null) {
            return;
        }

        List<ProdutoFornecedor> produtoFornecedores = produtoFornecedorRepository
                .findByProdutoItemRequisicaoItemRequisicaoId(itemRequisicao.getSimilar().getSimilarId());

        if (produtoFornecedores == null || produtoFornecedores.isEmpty()) {
            return;
        }

        for (ProdutoFornecedor produtoFornecedor : produtoFornecedores) {
            FornecedorCnpj fornecedorCnpj = produtoFornecedor.getFornecedor()
                    .getFornecedores()
                    .stream()
                    .filter(f -> f.getTipo() == FornecedorEnum.MATRIZ)
                    .findFirst()
                    .orElse(produtoFornecedor.getFornecedor().getFornecedores().get(0));

            List<Cotacao> cotacoesExistentes = cotacaoRepository
                    .findAllByFornecedorCnpjAndItemRequisicaoSimilarSimilarId(fornecedorCnpj, itemRequisicao.getSimilar().getSimilarId());

            Cotacao novaCotacao = Cotacao.builder()
                    .itemRequisicao(itemRequisicao)
                    .fornecedorCnpj(fornecedorCnpj)
                    .quantidade(itemRequisicao.getQuantidade())
                    .valorUnitario(BigDecimal.ZERO)
                    .tempoEntrega(null)
                    .createdAt(Date.valueOf(LocalDate.now()))
                    .estadoCotacao(EstadoItemEnum.COTANDO)
                    .build();

            // Verifique se uma cotação já existe
            if (cotacoesExistentes.isEmpty()) {
                cotacaoRepository.save(novaCotacao);
            } else {
                cotacoesExistentes.forEach(cotacaoExistente -> {
                    cotacaoExistente.setQuantidade(itemRequisicao.getQuantidade());
                    cotacaoExistente.setItemRequisicao(itemRequisicao);
                    cotacaoRepository.save(cotacaoExistente);
                });
            }
        }
    }

    public void construcaoEditar (EditarItemRequisicaoDTO editarItemRequisicaoDTO, Long requisicaoId) throws BadRequestException {
        ItemRequisicao itemRequisicao = this.assertItemRequisicao(editarItemRequisicaoDTO.itemId());
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);

        itemRequisicao.setReferencia(editarItemRequisicaoDTO.referencia());
        itemRequisicao.setQuantidade(editarItemRequisicaoDTO.quantidade());
        itemRequisicao.setObservacao(editarItemRequisicaoDTO.observacao());
        itemRequisicao.setDestino(editarItemRequisicaoDTO.destino());

        switch (requisicao.getDestino()){
            case VENDA_ESTOQUE:
                break;
            case ESTOQUE, VENDA:
                if(!editarItemRequisicaoDTO.destino().equals(requisicao.getDestino())){
                    requisicao.setDestino(DestinoEnum.VENDA_ESTOQUE);
                }
                break;
        }

        this.saveItemRequisicao(itemRequisicao);
    }

    public void construcaoExcluir (Long id) {
        ItemRequisicao itemRequisicao = this.repository.findById(id).orElse(null);

        if (itemRequisicao != null) {
            itemRequisicao.setStatus(false);

            this.repository.save(itemRequisicao);
        }
    }

    public List<ListagemItensRequisicaoConstrucaoDTO> construcaoListar (Long id) {
        return new ItemRequisicao().itensRequisicoesTOitensRequisicaoConstrucaoDTOS(this.repository.findAllByRequisicaoIdAndStatusIsTrue(id));
    }

    // ---------------- COTAÇÃO ---------------- //

    public void cotacaoInserir (InserirItemEmFaseCotacaoDTO inserirItemEmFaseCotacaoDTO, Long id) throws BadRequestException {
        Requisicao requisicao = this.requisicaoRepository.getReferenceById(id);
        if (requisicao.getEstagio() != EstagioEnum.COTACAO
                && requisicao.getEstagio() != EstagioEnum.REVISAO
                && requisicao.getEstagio() != EstagioEnum.APROVACAO) {
            return;
        }

        ItemRequisicao itemRequisicao = new ItemRequisicao();
        itemRequisicao.setReferencia(inserirItemEmFaseCotacaoDTO.referencia());
        itemRequisicao.setQuantidade(inserirItemEmFaseCotacaoDTO.quantidade());
        itemRequisicao.setObservacao(inserirItemEmFaseCotacaoDTO.observacao());
        itemRequisicao.setRequisicao(requisicao);
        itemRequisicao.setEstadoItem(EstadoItemEnum.COTANDO);
        itemRequisicao.setEncontrado(false);
        itemRequisicao.setDestino(inserirItemEmFaseCotacaoDTO.destino() == null ? DestinoEnum.VENDA : inserirItemEmFaseCotacaoDTO.destino());
        itemRequisicao.setStatus(true);

        ItemRequisicao itemRequisicaoCreate = this.repository.save(itemRequisicao);

        this.alertaItemService
                .saveAlertaItem(
                        AlertaItem.builder()
                                .itemRequisicao(itemRequisicaoCreate)
                                .descricao(inserirItemEmFaseCotacaoDTO.justificativa())
                                .build());

        createInitialCotacao(itemRequisicaoCreate);
    }

    public ResponseEntity<?> revisaoInserir (InserirItemEmFaseCotacaoDTO inserirItemEmFaseCotacaoDTO, Long id) throws BadRequestException {
        Optional<Requisicao> requisicao = this.requisicaoRepository.findByRequisicaoIdAndStatusIsTrue(id);
        if (requisicao.isEmpty()) {
            return ResponseEntity.badRequest().body("Requisição não encontrada");
        }

        if (requisicao.get().getEstagio() != EstagioEnum.REVISAO) {
            return ResponseEntity.badRequest().body("Requisição não está no estágio de revisão");
        }

        Similar similar = findSimilarByReferencia(inserirItemEmFaseCotacaoDTO.referencia());

        ItemRequisicao ir = ItemRequisicao.builder()
                .requisicao(requisicao.get())
                .referencia(inserirItemEmFaseCotacaoDTO.referencia())
                .estadoItem(EstadoItemEnum.COTANDO)
                .encontrado(similar != null)
                .destino(
                        inserirItemEmFaseCotacaoDTO.destino() == null ?
                                DestinoEnum.VENDA
                                :
                                inserirItemEmFaseCotacaoDTO.destino())
                .observacao(inserirItemEmFaseCotacaoDTO.observacao())
                .status(true)
                .quantidade(inserirItemEmFaseCotacaoDTO.quantidade())
                .similar(similar)
                .build();

        ItemRequisicao itemRequisicao = this.repository.save(ir);

        alertaItemService.saveAlertaItem(
                AlertaItem.builder()
                        .itemRequisicao(itemRequisicao)
                        .descricao(inserirItemEmFaseCotacaoDTO.justificativa())
                        .build());

        createInitialCotacao(itemRequisicao);

        return ResponseEntity.ok().build();
    }

    private Similar findSimilarByReferencia(String referencia) {
        Optional<Similar> similar = this.produtoSimilarRepository.findSimilarByReferenciaAndStatusIsTrue(referencia);
        return similar.orElse(null);
    }

    public List<ListagemItensRequisicaoCotacaoDTO> cotacaoListar (Long id) {
        if (this.requisicaoRepository.findById(id).get().getEstagio() != EstagioEnum.COTACAO
                && this.requisicaoRepository.findById(id).get().getEstagio() != EstagioEnum.REVISAO
                && this.requisicaoRepository.findById(id).get().getEstagio() != EstagioEnum.APROVACAO) {
            return null;
        }
        return new ItemRequisicao().itensRequisicoesTOitensRequisicaoCotacaoDTOS(this.repository.findAllByRequisicaoIdAndStatusIsTrue(id));
    }

    public List<ListagemItensCotacaoDTO> cotacaoListarItens (Long id) {
        Requisicao requisicao = this.requisicaoRepository.getReferenceById(id);
        if (requisicao.getEstagio() != EstagioEnum.COTACAO) {
            return null;
        }
        List<ItemRequisicao> itemRequisicao = this.repository.findAllByRequisicaoIdAndStatusIsTrue(id);
        return itemRequisicao.stream().map(
                itemRequisicao1 -> new ListagemItensCotacaoDTO(
                        itemRequisicao1.getItemRequisicaoId(),
                        itemRequisicao1.getSimilar().getProduto().getNome(),
                        itemRequisicao1.getReferencia(),
                        itemRequisicao1.getObservacao()
                )
        ).collect(Collectors.toList());
    }
    // ---------------- REVISÃO ---------------- //
    public List<ListagemItensRevisaoCotacaoDTO> cotacaoRevisaoListarItens (Long id) {
        Requisicao requisicao = this.requisicaoRepository.getReferenceByIdAndStatusIsTrue(id);
        if (requisicao.getEstagio() != EstagioEnum.REVISAO) {
            return null;
        }

        List<ItemRequisicao> itemRequisicao = this.repository.findAllByRequisicaoIdAndStatusIsTrue(id);

        return itemRequisicao.stream().map(
                ir -> {
                    if (ir.getEncontrado()){
                        return ListagemItensRevisaoCotacaoDTO.builder()
                                .itemId(ir.getItemRequisicaoId())
                                .encontrado(true)
                                .referencia(ir.getSimilar().getReferencia())
                                .nomeProduto(ir.getSimilar().getProduto().getNome())
                                .grupo(ir.getSimilar().getProduto().getSubgrupo().getGrupo().getNome())
                                .subgrupo(ir.getSimilar().getProduto().getSubgrupo().getNome())
                                .quantidade(ir.getQuantidade())
                                .produtoId(ir.getSimilar().getProduto().getProdutoId())
                                .similarId(ir.getSimilar().getSimilarId())
                                .observacao(ir.getObservacao())
                                .destino(ir.getDestino())
                                .estado(ir.getEstadoItem())
                                .build();
                    }
                    else{
                        return ListagemItensRevisaoCotacaoDTO.builder()
                                .itemId(ir.getItemRequisicaoId())
                                .encontrado(false)
                                .referencia(ir.getReferencia())
                                .nomeProduto(null)
                                .grupo(null)
                                .subgrupo(null)
                                .quantidade(ir.getQuantidade())
                                .destino(ir.getDestino())
                                .estado(ir.getEstadoItem())
                                .build();
                    }
                }
        ).collect(Collectors.toList());
    }
    public void CotacaoAddAlerta (CadastrarAlertaDTO alertaDTO, Long id) throws BadRequestException {
        ItemRequisicao itemRequisicao = new ItemRequisicao();
        itemRequisicao.setItemRequisicaoId(alertaDTO.itemId());
        AlertaItem alertaItem = AlertaItem.builder()
                .descricao(alertaDTO.alerta())
                .itemRequisicao(itemRequisicao)
                .build();
        this.alertaItemService.saveAlertaItem(alertaItem);
    }


    public List<ListagemSimilaresRevisaoCotacaoDTO> findSimilaresByItemId (Long itemId) {
        ItemRequisicao itemRequisicao = this.repository.getReferenceByIdAndStatusIsTrue(itemId);

        Long similarId = itemRequisicao.getSimilar().getSimilarId();
        Long produtoId = itemRequisicao.getSimilar().getProduto().getProdutoId();

        List<Similar> similares = this.produtoSimilarRepository.findSimilaresByProdutoId(produtoId);

        return similares.stream().map(
                similar -> ListagemSimilaresRevisaoCotacaoDTO.builder()
                        .similarId(similar.getSimilarId())
                        .selecionado(similar.getSimilarId().equals(similarId))
                        .marca(similar.getMarca() != null ? similar.getMarca().getNome() : null)
                        .referencia(similar.getReferencia())
                        .observacao(similar.getObservacao())
                        .build()
        ).collect(Collectors.toList());
    }

    // ---------------- APROVAÇÃO ---------------- //

    public void aprovacaoAlterar (EditarAprovacaoDTO aprovacaoDTO , Long id) {
        ItemRequisicao itemRequisicao = this.repository.findById(id).orElse(null);

        assert itemRequisicao != null;
        itemRequisicao.setEstadoItem(aprovacaoDTO.estado());

        this.repository.save(itemRequisicao);
    }

    public void aprovacaoAddAlerta (CadastrarAlertaDTO alertaDTO, Long id) throws BadRequestException {
        ItemRequisicao itemRequisicao = new ItemRequisicao();
        itemRequisicao.setItemRequisicaoId(alertaDTO.itemId());
        this.alertaItemService.saveAlertaItem(
                AlertaItem.builder()
                        .descricao(alertaDTO.alerta())
                        .itemRequisicao(itemRequisicao)
                .build());
    }

    public void aprovacaoExcluir (Long id) {
        ItemRequisicao itemRequisicao = this.repository.findById(id).orElse(null);

        if (itemRequisicao != null) {
            itemRequisicao.setStatus(false);

            this.repository.save(itemRequisicao);
        }
    }

    public List<ListagemItensRequisicaoAprovacaoDTO> ItensListar (Long id, EstagioEnum estagio) {
        return new ItemRequisicao()
                .itensRequisicoesTOitensRequisicaoAprovacaoDTOS(this.repository.findAllByRequisicaoRequisicaoIdAndRequisicaoEstagio(id, estagio));
    }

    public void editarItem(Long id, EditarConstrucaoDTO item) {
        Requisicao requisicao = this.requisicaoRepository.findById(id).orElse(null);
        ItemRequisicao itemRequisicao = this.repository.findById(item.itemId()).orElse(null);
        if (itemRequisicao != null) {
            itemRequisicao.setReferencia(item.referencia());
            itemRequisicao.setQuantidade(item.quantidade());
            itemRequisicao.setObservacao(item.observacao());
            itemRequisicao.setRequisicao(requisicao);
            this.repository.save(itemRequisicao);
        }
    }



    public void excluirItem(Long id, DeleteDTO deleteDTO) {
        Requisicao requisicao = this.requisicaoRepository.findById(id).orElse(null);
        ItemRequisicao itemRequisicao = this.repository.findById(deleteDTO.idToDelete()).orElse(null);
        if (itemRequisicao != null) {
            itemRequisicao.setStatus(false);
            this.repository.save(itemRequisicao);
        }
    }


    //UnificacaoService
    public List<ListagemItemEstoqueUnificacaoDTO> listarItensRequisicaoPorDestino(DestinoEnum destino) {
        EstadoItemEnum estado = EstadoItemEnum.REMOVIDO;
        List<ItemRequisicao> itemRequisicao =  this.repository.findAllByDestinoAndEstadoItemNot(destino, estado);
        return itemRequisicao.stream().map(
                itemRequisicao1 -> new ListagemItemEstoqueUnificacaoDTO(
                        itemRequisicao1.getItemRequisicaoId(),
                        itemRequisicao1.getRequisicao().getRequisicaoId(),
                        itemRequisicao1.getSimilar().getProduto().getNome(),
                        itemRequisicao1.getQuantidade(),
                        itemRequisicao1.getSimilar().getProduto().getSubgrupo().getGrupo().getNome()
                )
        ).collect(Collectors.toList());
    }
    public void editarItemUnificado(Long id, QuantidadeDTO quantidade) {
        ItemRequisicao itemRequisicao = this.repository.findById(id).orElse(null);
        if (itemRequisicao != null) {
            itemRequisicao.setQuantidade(quantidade.quantidade());
            this.repository.save(itemRequisicao);
        }
    }
    public ItemDetalhadoDTO listarItem(Long itemId){
        ItemRequisicao itemRequisicao = this.repository.findById(itemId).orElse(null);
        assert itemRequisicao != null;
        return new ItemDetalhadoDTO(
                itemRequisicao.getSimilar().getProduto().getNome(),
                itemRequisicao.getQuantidade(),
                itemRequisicao.getSimilar().getProduto().getSubgrupo().getGrupo().getNome(),
                itemRequisicao.getSimilar().getProduto().getSubgrupo().getNome(),
                itemRequisicao.getRequisicao().getRequisicaoId().toString(),
                itemRequisicao.getRequisicao().getNome()
        );
    }

    public ItemRequisicao putEditItemRequisicao (EditarItemRequisicaoDTO itemRequisicao) throws BadRequestException {
        ItemRequisicao ir = this.assertItemRequisicao(itemRequisicao.itemId());

        ir.setReferencia(itemRequisicao.referencia());
        ir.setQuantidade(itemRequisicao.quantidade());
        ir.setObservacao(itemRequisicao.observacao());
        ir.setDestino(itemRequisicao.destino());

        switch (ir.getRequisicao().getDestino()){
            case VENDA_ESTOQUE:
                break;
            case ESTOQUE, VENDA:
                if(!itemRequisicao.destino().equals(ir.getRequisicao().getDestino())){
                    ir.getRequisicao().setDestino(DestinoEnum.VENDA_ESTOQUE);
                }
                break;
        }

        return this.saveItemRequisicao(ir);
    }

    public ItemRequisicao assertItemRequisicao(Long itemId) throws BadRequestException {
        return repository.findByIdAndStatusIsTrue(itemId).orElseThrow(() -> new BadRequestException("Item não encontrado"));
    }

    public ItemRequisicao saveItemRequisicao(@Valid ItemRequisicao itemRequisicao) {
        return repository.save(itemRequisicao);
    }

    public ItemRequisicao patchSimilar(Long itemId, Long similarId) throws BadRequestException {
        ItemRequisicao itemRequisicao = assertItemRequisicao(itemId);
        Similar similar = similarService.assertSimilar(similarId);

        itemRequisicao.setSimilar(similar);
        itemRequisicao.setEncontrado(true);
        itemRequisicao.setReferencia(similar.getReferencia());

        return this.saveItemRequisicao(itemRequisicao);
    }
}
