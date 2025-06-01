package org.example.mirinayapi.service.cotacao.estagios;

import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.MirinayModel;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoFornecedorDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoFornecedorItemDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoItemCotacaoDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoItemDTO;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.PutCotacaoCotarFornecedorDTO;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.margem.DTO.MargemDTO;
import org.example.mirinayapi.model.margem.Margem;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.planilha.dto.InfoDTO;
import org.example.mirinayapi.planilha.generatedExcel;
import org.example.mirinayapi.service.*;
import org.example.mirinayapi.service.cotacao.utils.CotacaoUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.util.*;

@Service
public class CotacaoCotacaoService {
    private final ItemRequisicaoService itemRequisicaoService;
    private final CotacaoUtils cotacaoUtils;
    private final RequisicaoService requisicaoService;
    private final CotacaoRepository cotacaoRepository;
    private final FornecedorCnpjService fornecedorCnpjService;
    private final MarcaService marcaService;
    private final MargemService margemService;

    public CotacaoCotacaoService(
            @Lazy ItemRequisicaoService itemRequisicaoService,
            CotacaoUtils cotacaoUtils,
            @Lazy RequisicaoService requisicaoService,
            CotacaoRepository cotacaoRepository,
            @Lazy FornecedorCnpjService fornecedorCnpjService,
            @Lazy MarcaService marcaService,
            @Lazy MargemService margemService
    ) {
        this.itemRequisicaoService = itemRequisicaoService;
        this.cotacaoUtils = cotacaoUtils;
        this.requisicaoService = requisicaoService;
        this.cotacaoRepository = cotacaoRepository;
        this.fornecedorCnpjService = fornecedorCnpjService;
        this.marcaService = marcaService;
        this.margemService = margemService;
    }

// --------------------------- GET ----------------------------

    public List<GetCotacaoItemDTO> getCotacaoItem(Long requisicaoId) throws BadRequestException {
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);

        return requisicao.getItensRequisicao().stream().map(
                ir -> GetCotacaoItemDTO.builder()
                        .itemId(ir.getItemRequisicaoId())
                        .produtoId(ir.getSimilar().getProduto().getProdutoId())
                        .similarId(ir.getSimilar().getSimilarId())
                        .nomeProduto(ir.getSimilar().getProduto().getNome())
                        .observacao(ir.getObservacao())
                        .quantidade(ir.getQuantidade())
                        .estado(ir.getEstadoItem())
                        .marca(ir.getSimilar().getMarca().getNome())
                        .build()
        ).toList();
    }

    public List<GetCotacaoItemCotacaoDTO> getCotacaoItemCotacao(Long itemId) throws BadRequestException {
        ItemRequisicao itemRequisicao = itemRequisicaoService.assertItemRequisicao(itemId);

        Date dataLimite = new Date(System.currentTimeMillis() - 6 * 30 * 24 * 60 * 60 * 1000L);

        return itemRequisicao.getCotacoes().stream().map(
                cotacao -> {
                    Cotacao ultimaCotacao = this.getUltimaCotacao(itemRequisicao, cotacao);

                    Margem margem = cotacao.getMargem();

                    return GetCotacaoItemCotacaoDTO.builder()
                            .dataUltimaCotacao(ultimaCotacao != null ? ultimaCotacao.getCreatedAt() : null)
                            .precoUltimaCotacao(ultimaCotacao != null ? ultimaCotacao.getValorUnitario() : null)
                            .cotacaoId(cotacao.getCotacaoId())
                            .nomeFornecedor(cotacao.getFornecedorCnpj().getFornecedor().getNome())
                            .precoUnit(cotacao.getValorUnitario())
                            .estado(cotacao.getEstadoCotacao())
                            .observacao(cotacao.getObservacao())
                            .quantidade(cotacao.getQuantidade())
                            .st(cotacao.getSt())
                            .ipi(cotacao.getIpi())
                            .difal(cotacao.getDifal())
                            .margem(MargemDTO.builder()
                                    .nome(margem.getNome())
                                    .valor(margem.getValorMargem())
                                    .margemId(margem.getMargemId())
                                    .build())
                            .build();
                }
        ).toList();
    }

    public List<GetCotacaoFornecedorDTO> getCotacaoFornecedor(Long requisicaoId) throws BadRequestException {
        List<FornecedorCnpj> fornecedorCnpjs = requisicaoService.getFornecedoresCnpjs(requisicaoId);

        return fornecedorCnpjs.stream().map(
                fornecedorCnpj -> GetCotacaoFornecedorDTO.builder()
                        .cnpjId(fornecedorCnpj.getFornecedorCnpjId())
                        .nomeFornecedor(
                                fornecedorCnpj.getNome().isEmpty() ?
                                        fornecedorCnpj.getFornecedor().getNome()
                                        :
                                        fornecedorCnpj.getNome()
                        )
                        .observacao("--- EM PRODUÇÃO ---") // TODO: IMplementar esse sistema de observação
                        .build()
        ).toList();
    }

    public List<GetCotacaoFornecedorItemDTO> getCotacaoFornecedorItem(Long requisicaoId, Long cnpjId) throws BadRequestException {
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);
        FornecedorCnpj fornecedorCnpj = fornecedorCnpjService.assertFornecedorCnpj(cnpjId);

        return requisicao.getCotacoes().stream().map(
                cotacao -> {
                    if (cotacao.getFornecedorCnpj().getFornecedorCnpjId()
                            .equals(fornecedorCnpj.getFornecedorCnpjId())) {

                        Cotacao ultimaCotacao = getUltimaCotacao(cotacao.getItemRequisicao(), cotacao);

                        Margem margem = cotacao.getMargem();

                        return GetCotacaoFornecedorItemDTO.builder()
                                .quantidadeItem(cotacao.getItemRequisicao().getQuantidade())
                                .quantidadeCotada(cotacao.getQuantidade())
                                .referencia(cotacao.getItemRequisicao().getReferencia())
                                .precoUltimaCotacao(
                                        ultimaCotacao != null
                                                ?
                                                ultimaCotacao.getValorUnitario()
                                                :
                                                null)
                                .dataUltimaCotacao(
                                        ultimaCotacao != null
                                                ?
                                                ultimaCotacao.getCreatedAt()
                                                :
                                                null)
                                .cotacaoId(cotacao.getCotacaoId())
                                .estado(cotacao.getEstadoCotacao())
                                .st(cotacao.getSt())
                                .ipi(cotacao.getIpi())
                                .difal(cotacao.getDifal())
                                .margem(MargemDTO.builder()
                                        .margemId(margem.getMargemId())
                                        .valor(margem.getValorMargem())
                                        .nome(margem.getNome())
                                        .build())
                                .marca(cotacao.getItemRequisicao().getSimilar().getMarca().getNome())
                                .precoUnit(cotacao.getValorUnitario())
                                .build();
                    }
                    else {
                        return null;
                    }
                }
        ).toList();
    }

    // --------------------------- POST ----------------------------

    public ResponseEntity<?> putCotacaoCotar(Long requisicaoId, Long cotacaoId, PutCotacaoCotarFornecedorDTO cotarFornecedorDTO) throws BadRequestException {
        Cotacao cotacao = cotacaoUtils.assertCotacao(cotacaoId);
        Margem margem = margemService.assertMargem(cotarFornecedorDTO.margemId());

        cotacao.setQuantidade(cotarFornecedorDTO.quantidade());
        cotacao.setDifal(cotarFornecedorDTO.difal());
        cotacao.setIpi(cotarFornecedorDTO.ipi());
        cotacao.setMargem(margem);
        cotacao.setTempoEntrega(cotarFornecedorDTO.tempoEntrega());
        cotacao.setValorUnitario(cotarFornecedorDTO.valorUnitario());
        cotacao.setSt(cotarFornecedorDTO.st());
        cotacao.setUltimaCotacao(new java.sql.Date(System.currentTimeMillis()));

        cotacaoUtils.saveCotacao(cotacao);

        return ResponseEntity.ok().build();
    }

    // --------------------------- AUX ----------------------------

    private Cotacao getUltimaCotacao(ItemRequisicao itemRequisicao, Cotacao cotacao){
        Date dataLimite = new Date(System.currentTimeMillis() - 6 * 30 * 24 * 60 * 60 * 1000L);

        return this.cotacaoRepository.findCotacoesByDataLimiteAndSimilarAndCnpjId(
                    itemRequisicao.getSimilar().getSimilarId(),
                    cotacao.getFornecedorCnpj().getFornecedorCnpjId(),
                    dataLimite
            ).stream().findFirst().orElse(null);
    }

    public void generatedExcel(Long fornecedorId, Long requisicaoId, OutputStream outputStream) {
        List<Cotacao> cotacoes = cotacaoRepository.findAllByFornecedorAndRequisicao(fornecedorId, requisicaoId);

        if (cotacoes.isEmpty()) {
            throw new IllegalArgumentException("Nenhuma cotação encontrada para o fornecedor e requisição fornecidos.");
        }

        List<InfoDTO> products = cotacoes.stream()
                .filter(cotacao -> cotacao.getItemRequisicao() != null &&
                        cotacao.getItemRequisicao().getSimilar() != null &&
                        cotacao.getFornecedorCnpj() != null)
                .map(cotacao -> new InfoDTO(
                        cotacao.getItemRequisicao().getSimilar().getProduto().getNome(),
                        cotacao.getItemRequisicao().getRequisicao().getUsuario().getName(),
                        cotacao.getItemRequisicao().getSimilar().getProduto().getDescricao(),
                        cotacao.getItemRequisicao().getSimilar().getProduto().getProdutosSimilares().stream()
                                .map(Similar::getReferencia)
                                .toList(),
                        cotacao.getFornecedorCnpj().getFornecedor().getNome(),
                        cotacao.getItemRequisicao().getSimilar().getMarca().getNome(),
                        cotacao.getQuantidade(),
                        cotacao.getValorUnitario()
                ))
                .toList();

        try {
            MirinayModel companyInfo = new MirinayModel();
            companyInfo.setName("MIRINAY COMERCIO DE PEÇAS AGRÍCOLAS LTDA ME");
            companyInfo.setCnpj("01.780.181/0001-89");
            companyInfo.setPhone("(55) 3433-7726");

            generatedExcel generator = new generatedExcel();
            byte[] excelBytes = generator.generatedExcel(products, companyInfo);

            // Escrevendo os bytes no OutputStream
            outputStream.write(excelBytes);

        } catch (IOException e) {
            throw new RuntimeException("Erro ao gerar o arquivo Excel.", e);
        }
    }

}
