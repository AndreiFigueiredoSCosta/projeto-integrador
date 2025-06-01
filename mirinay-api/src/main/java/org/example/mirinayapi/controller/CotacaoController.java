package org.example.mirinayapi.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.classificacaoFornecedor.ClassificacaoFornecedor;
import org.example.mirinayapi.model.classificacaoFornecedor.dto.ClassificacaoDTO;
import org.example.mirinayapi.model.cotacao.DTO.ListagemCotacao;
import org.example.mirinayapi.model.cotacao.DTO.ListagemCotacaoConcluidas;
import org.example.mirinayapi.model.cotacao.DTO.ListagemFornecedoresAprovacaoDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoFornecedorDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoFornecedorItemDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoItemCotacaoDTO;
import org.example.mirinayapi.model.cotacao.DTO.cotacao.GetCotacaoItemDTO;
import org.example.mirinayapi.model.cotacao.DTO.revisao.ListagemRevisaoFornecedorDTO;
import org.example.mirinayapi.model.cotacao.DTO.revisao.ListagemRevisaoProdutoCotacoesDTO;
import org.example.mirinayapi.model.cotacao.DTO.revisao.RevisaoInsertCNPJDTO;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.itemRequisicao.DTO.InserirItemEmFaseCotacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.EditarItemRequisicaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.*;
import org.example.mirinayapi.model.misc.DeleteDTO;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.service.cotacao.CotacaoService;
import org.example.mirinayapi.service.ClassificacaoService;
import org.example.mirinayapi.service.cotacao.estagios.CotacaoCotacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.example.mirinayapi.controller.RequisicaoController.getPagedModelResponseEntity;

@RestController
@RequestMapping("/cotacao")
@CrossOrigin(origins = "*")
public class CotacaoController {


    private final CotacaoCotacaoService cotacaoCotacaoService;
    private final CotacaoService cotacaoService;
    private final PagedResourcesAssembler<ListagemCotacaoConcluidas> pagedResourcesAssembler;
    private final ClassificacaoService classificacaoService;

    @Autowired
    public CotacaoController(CotacaoCotacaoService cotacaoCotacaoService, CotacaoService cotacaoService, PagedResourcesAssembler<ListagemCotacaoConcluidas> pagedResourcesAssembler, ClassificacaoService classificacaoService) {
        this.cotacaoCotacaoService = cotacaoCotacaoService;
        this.cotacaoService = cotacaoService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.classificacaoService = classificacaoService;
    }

    // Sumário

    // ----------------------------- GET -----------------------------
    @GetMapping
    public ResponseEntity<List<ListagemCotacao>> getRequisicoesEmEstadoCotacao() {
        List<ListagemCotacao> cotacoes = cotacaoService.getRequisicoesEmEstadoCotacao();
        return ResponseEntity.ok(cotacoes);
    }

    @GetMapping("/concluido")
    public ResponseEntity<PagedModel<EntityModel<ListagemCotacaoConcluidas>>>getRequisicoesConcluidas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    )
        {
            Pageable pageable = PageRequest.of(page, size);
            List<ListagemCotacaoConcluidas> cotacoesConcluidas = cotacaoService.getRequisicoesConcluidas(pageable);
            return getPagedModelResponseEntity(pageable, cotacoesConcluidas, pagedResourcesAssembler);
        }

    @GetMapping("/detalhes/{id}/fornecedores")
    public ResponseEntity<List<ListagemFornecedoresRevisaoDTO>> getFornecedoresCotacao(@PathVariable Long id) {
        List<ListagemFornecedoresRevisaoDTO> fornecedores = cotacaoService.getFornecedoresCotacao(id);
        return ResponseEntity.ok(fornecedores);
    }

    // Detalhes

    @PatchMapping("/detalhes/{requisicaoId}/estagio/{estagio}/alterar")
    public ResponseEntity<?> patchDetalhesAlterarEstagio(
            @PathVariable Long requisicaoId,
            @PathVariable EstagioEnum estagio
    ) throws BadRequestException {
        return cotacaoService.patchDetalhesAlterarEstagio(requisicaoId, estagio);
    }

    // Revisão
    // ----------------------------- GET -----------------------------

    // Retorna os itens com referência cadastrada e encontrada ou não
    @GetMapping("/detalhes/{requisicaoId}/revisao/item")
    public ResponseEntity<List<ListagemItensRevisaoCotacaoDTO>> getRevisaoItem(
            @PathVariable Long requisicaoId
    ) {
        List<ListagemItensRevisaoCotacaoDTO> itensRevisao = cotacaoService.getRevisaoItem(requisicaoId);
        return ResponseEntity.ok(itensRevisao);
    }

    // Retorna os similares de um item
    @GetMapping("/detalhes/{requisicaoId}/revisao/item/{itemId}/similar")
    public ResponseEntity<List<ListagemSimilaresRevisaoCotacaoDTO>> getRevisaoItemSimilar(
            @PathVariable Long requisicaoId,
            @PathVariable Long itemId
    ) {
        List<ListagemSimilaresRevisaoCotacaoDTO> similares = cotacaoService.getRevisaoItemSimilar(itemId);
        return ResponseEntity.ok(similares);
    }

    // Retorna as cotações (fornecedores clonados) de um item
    @GetMapping("/detalhes/{requisicaoId}/revisao/item/{itemId}/cotacao")
    public ResponseEntity<List<ListagemRevisaoProdutoCotacoesDTO>> getRevisaoItemCotacao(
            @PathVariable Long requisicaoId,
            @PathVariable Long itemId
    ) throws BadRequestException {
        List<ListagemRevisaoProdutoCotacoesDTO> fornecedoreClonados = cotacaoService.getRevisaoItemCotacao(itemId);
        return ResponseEntity.ok(fornecedoreClonados);
    }

    // Retorna os fornecedores cotados de todos os itens de uma requisição
    @GetMapping("/detalhes/{requisicaoId}/revisao/fornecedor")
    public ResponseEntity<List<ListagemRevisaoFornecedorDTO>> getRevisaoFornecedor(
            @PathVariable Long requisicaoId
    ) throws BadRequestException {
        List<ListagemRevisaoFornecedorDTO> fornecedores = cotacaoService.getRevisaoFornecedor(requisicaoId);
        return ResponseEntity.ok(fornecedores);
    }

    // Retorna os IDs dos CNPJs cotados em todos os itens de uma requisição
    @GetMapping("/detalhes/{requisicaoId}/revisao/fornecedor/{fornecedorId}/cnpj")
    public ResponseEntity<List<Long>> getRevisaoIdsCNPJs(
            @PathVariable Long requisicaoId,
            @PathVariable Long fornecedorId
    ) {
        List<Long> fornecedores = cotacaoService.getRevisaoIdsCNPJs(requisicaoId, fornecedorId);
        return ResponseEntity.ok(fornecedores);
    }

    // ----------------------------- POST -----------------------------

    // Cota todos os fornecedores de uma clonagem para um item
    @PostMapping("/detalhes/{requisicaoId}/revisao/item/{itemId}/clonar/{clonagemId}")
    @Transactional
    public ResponseEntity<?> postRevisaoCotarClonagem(
            @PathVariable Long requisicaoId,
            @PathVariable Long itemId,
            @PathVariable Long clonagemId
    ) throws BadRequestException {
        return cotacaoService.postRevisaoCotarClonagem(itemId, clonagemId, requisicaoId);
    }

    // Cadastra um produto e um idSimilar para um item que não possui uma referência encontrada
    @PostMapping("/detalhes/{requisicaoId}/revisao/item/produto/cadastrar")
    @Transactional
    public ResponseEntity<?> postRevisaoCadastrarNovoProduto(
            @PathVariable Long requisicaoId,
            @RequestBody PostCotacaoRevisaoProdutoSimilarDTO item
    ) throws BadRequestException {
        return this.cotacaoService.postRevisaoCadastrarNovoProduto(item);
    }

    // Cadastra um idSimilar em um produto para um item que não possui uma referência encontrada
    @PostMapping("/detalhes/{requisicaoId}/revisao/item/similar/cadastrar")
    @Transactional
    public ResponseEntity<?> postRevisaoCadastrarNovoSimilar(
            @PathVariable Long requisicaoId,
            @RequestBody PostRevisaoCadastrarSimilarDTO similar
    ) throws BadRequestException {
        return this.cotacaoService.postRevisaoCadastrarNovoSimilar(similar);
    }

    // Insere um item em uma requisição
    @PostMapping("/detalhes/{requisicaoId}/revisao/item/inserir")
    @Transactional
    public ResponseEntity<?> postRevisaoInserirItem(
            @PathVariable Long requisicaoId,
            @RequestBody InserirItemEmFaseCotacaoDTO item
    ) throws BadRequestException {
        return cotacaoService.postRevisaoInserirItem(requisicaoId, item);
    }

    // Insere CNPJs para um item
    @PostMapping("/detalhes/{requisicaoId}/revisao/item/{itemId}/fornecedor/inserir")
    @Transactional
    public ResponseEntity<?> postRevisaoCotarCNPJs(
            @PathVariable Long requisicaoId,
            @PathVariable Long itemId,
            @RequestBody RevisaoInsertCNPJDTO insertCNPJDTO
    ) throws BadRequestException {
        return this.cotacaoService.postRevisaoCotarCNPJs(requisicaoId, insertCNPJDTO, itemId);
    }

    // Insere CNPJs para todos os itens de uma requisição
    @PostMapping("/detalhes/{requisicaoId}/revisao/fornecedor/inserir")
    @Transactional
    public ResponseEntity<?> postRevisaoCotarCNPJsParaTodos(
            @PathVariable Long requisicaoId,
            @RequestBody RevisaoInsertCNPJDTO insertCNPJDTO
    ) throws BadRequestException {
        return this.cotacaoService.postRevisaoCotarCNPJsParaTodos(requisicaoId, insertCNPJDTO);
    }


    // ----------------------------- PATCH -----------------------------

    // Altera o idSimilar selecionado para um item
    @PatchMapping("/detalhes/{requisicaoId}/revisao/produto/{itemId}/similar/selecionar")
    @Transactional
    public ResponseEntity<?> patchRevisaoSelecionarSimilar(
            @PathVariable Long requisicaoId,
            @PathVariable Long itemId,
            @RequestBody Map<String, Object> requestBody
    ) {
        Long similarId = ((Number) requestBody.get("similarId")).longValue();

        return cotacaoService.patchRevisaoSelecionarSimilar(itemId, similarId);
    }

    @PatchMapping("/detalhes/{requisicaoId}/revisao/item/{itemId}/cotacao/{cotacaoId}/alterarCNPJ/{cnpjId}")
    @Transactional
    public ResponseEntity<?> patchRevisaoCotacaoAlterarCNPJ(
            @PathVariable Long requisicaoId,
            @PathVariable Long itemId,
            @PathVariable Long cotacaoId,
            @PathVariable Long cnpjId
    ) throws BadRequestException {
        return this.cotacaoService.patchRevisaoCotacaoAlterarCNPJ(cotacaoId, cnpjId);
    }

    // Altera o idSimilar de um item
    @PatchMapping("/detalhes/{requisicaoId}/revisao/item/{itemId}/similar/{similarId}/alterar")
    @Transactional
    public ResponseEntity<?> patchRevisaoAlterarReferencia(
            @PathVariable Long requisicaoId,
            @PathVariable Long itemId,
            @PathVariable Long similarId
    ) throws BadRequestException {
        return this.cotacaoService.patchRevisaoAlterarReferencia(itemId, similarId, requisicaoId);
    }

    // ----------------------------- PUT -----------------------------

    // Edita um item de uma requisição
    @PutMapping("/detalhes/{requisicaoId}/revisao/item/editar")
    @Transactional
    public ResponseEntity<?> putRevisaoEditarItem(
            @PathVariable Long requisicaoId,
            EditarItemRequisicaoDTO editarItemRequisicaoDTO
    ) throws BadRequestException {
        return this.cotacaoService.putRevisaoEditarItem(editarItemRequisicaoDTO, requisicaoId);
    }

    // ----------------------------- DELETE -----------------------------
    // Remove um item de uma requisição
    @DeleteMapping("/detalhes/{requisicaoId}/revisao/item/excluir")
    @Transactional
    public ResponseEntity<?> deleteRevisaoItem(
            @PathVariable Long requisicaoId,
            @RequestBody DeleteDTO deleteDTO
    ) throws BadRequestException {
        return this.cotacaoService.deleteRevisaoItem(deleteDTO);
    }

    // Remove uma cotacao de um item
    @DeleteMapping("/detalhes/{requisicaoId}/revisao/item/{itemId}/fornecedor/excluir")
    @Transactional
    public ResponseEntity<?> deleteRevisaoItemCotacao(
            @PathVariable Long requisicaoId,
            @PathVariable Long itemId,
            @RequestBody DeleteDTO deleteDTO
    ) throws BadRequestException {
        return this.cotacaoService.deleteRevisaoItemCotacao(deleteDTO);
    }

    // Remove um CNPJ de uma requisição
    @DeleteMapping("/detalhes/{requisicaoId}/revisao/fornecedor/excluir")
    @Transactional
    public ResponseEntity<?> deleteRevisaoCNPJ(
            @PathVariable Long requisicaoId,
            @RequestBody DeleteDTO deleteDTO) throws BadRequestException {
        return this.cotacaoService.deleteRevisaoCNPJ(requisicaoId, deleteDTO);
    }

    //Cotação
    // ----------------------------- GET -----------------------------

    @GetMapping("/detalhes/{requisicaoId}/cotacao/item")
    public ResponseEntity<List<GetCotacaoItemDTO>> getCotacaoItem(@PathVariable Long requisicaoId) throws BadRequestException {
        List<GetCotacaoItemDTO> itensRevisao = cotacaoService.getCotacaoItem(requisicaoId);
        return ResponseEntity.ok(itensRevisao);
    }

    @GetMapping("/detalhes/{requisicaoId}/cotacao/item/{itemId}/fornecedor")
    public ResponseEntity<List<GetCotacaoItemCotacaoDTO>> getCotacaoItemCotacao(@PathVariable Long itemId) throws BadRequestException {
        List<GetCotacaoItemCotacaoDTO> cotacoes = cotacaoService.getCotacaoItemCotacao(itemId);
        return ResponseEntity.ok(cotacoes);
    }

    @GetMapping("/detalhes/{requisicaoId}/cotacao/fornecedor")
    public ResponseEntity<List<GetCotacaoFornecedorDTO>> getCotacaoFornecedor(@PathVariable Long requisicaoId) throws BadRequestException {
        List<GetCotacaoFornecedorDTO> cotacoes = cotacaoService.getCotacaoFornecedor(requisicaoId);
        return ResponseEntity.ok(cotacoes);
    }

    @GetMapping("/detalhes/{requisicaoId}/cotacao/fornecedor/{cnpjId}/item")
    public ResponseEntity<List<GetCotacaoFornecedorItemDTO>> getCotacaoFornecedorItem(
            @PathVariable Long requisicaoId,
            @PathVariable Long cnpjId
    ) throws BadRequestException {
        List<GetCotacaoFornecedorItemDTO> cotacoes = cotacaoService.getCotacaoFornecedorItem(requisicaoId, cnpjId);
        return ResponseEntity.ok(cotacoes);
    }

    // ----------------------------- PATCH -----------------------------
//    @PatchMapping("/detalhes/{requisicaoId}/cotacao/item/{itemId}/fornecedor/{cotacaoId}/reaproveitar")
//    public ResponseEntity<?> patchCotacaoAlterarItem(
//            @PathVariable Long requisicaoId,
//            @PathVariable Long itemId,
//            @PathVariable Long cnpjId,
//            @RequestBody Map<String, Object> requestBody
//    ) {
//        return cotacaoService.patchCotacaoAlterarItem(requisicaoId, itemId, cnpjId, valor);
//    }

    // ----------------------------- PUT -----------------------------

    @PutMapping("/detalhes/{requisicaoId}/cotacao/{cotacaoId}/cotar")
    public ResponseEntity<?> putCotacaoCotar(
            @PathVariable Long requisicaoId,
            @PathVariable Long cotacaoId,
            @RequestBody PutCotacaoCotarFornecedorDTO cotacao
    ) throws BadRequestException {
        return cotacaoService.putCotacaoCotar(requisicaoId, cotacaoId, cotacao);
    }

    // ----------------------------- DELETE -----------------------------
//
//    @DeleteMapping("/detalhes/{requisicaoId}/cotacao/{cotacaoId}/excluir")
//    public ResponseEntity<?> deleteCotacao(@PathVariable Long requisicaoId, @PathVariable Long cotacaoId) {
//        return cotacaoService.deleteCotacao(requisicaoId, cotacaoId);
//    }

    //Aprovação

    // ----------------------------- GET -----------------------------

    @GetMapping("/detalhes/{id}/aprovacao")
    public ResponseEntity<List<ListagemItensAprovacaoDTO>> getAprovacaoProduto(@PathVariable Long id) {
        List<ListagemItensAprovacaoDTO> itensRevisao = cotacaoService.getItensAprovacaoPorRequisicao(id);
        return ResponseEntity.ok(itensRevisao);
    }
    //Aprovação


    @GetMapping("/detalhes/{id}/aprovacao/{itemId}/fornecedores")
    public ResponseEntity<List<ListagemFornecedoresAprovacaoDTO>> getAprovacaoFornecedoresProduto(@PathVariable Long id, @PathVariable Long itemId) {
        List<ListagemFornecedoresAprovacaoDTO> itensRevisao = cotacaoService.getFornecedoresItensAprovacao(id, itemId);
        return ResponseEntity.ok(itensRevisao);
    }

    // ----------------------------- PATCH -----------------------------

    @PatchMapping("/detalhes/{id}/aprovacao/aprovar")
    public ResponseEntity<Requisicao> buscarItensPorFornecedor(@PathVariable Long id) {
        Requisicao requisicao = cotacaoService.aprovarRequisicao(id);
        return ResponseEntity.ok(requisicao);
    }




    @PostMapping("/detalhes/aprovacao/fornecedor/classificar")
    public ResponseEntity<?> classificarFornecedor(@RequestBody ClassificacaoDTO classificacaoDTO) {

        if (classificacaoDTO == null) {
            return ResponseEntity.badRequest().body("Classificação deve ser fornecida.");
        }
        try {
            // Chama o serviço para processar a classificação
            ClassificacaoFornecedor classificacaoFornecedor = classificacaoService.classificarFornecedor(classificacaoDTO);
            return ResponseEntity.ok(classificacaoFornecedor);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fornecedor não encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar a solicitação.");
        }
    }

    @PutMapping("/detalhes/{id}/aprovacao/item/{itemId}/alterarEstado")
    public ResponseEntity<?> alterarEstadoItem(@PathVariable Long id, @PathVariable Long itemId, @RequestBody EstadoDTO estado) {
        if (id == null || itemId == null || estado == null) {
            return ResponseEntity.badRequest().body("Fornecedor ID e Estado devem ser fornecidos.");
        }
        try {
            // Chama o serviço para processar a aprovação
            cotacaoService.alterarEstadoCotacao(id, itemId, estado);
            return ResponseEntity.ok("Estado do item alterado com sucesso.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item não encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar a solicitação.");
        }

    }

    @PatchMapping("/detalhes/{id}/aprovacao/item/{cotacaoId}/alterarEstado")
    public ResponseEntity<?> aprovarCotacaoFornecedor(@PathVariable Long id, @PathVariable Long cotacaoId, @RequestBody EstadoDTO estado) {
        if (id == null || cotacaoId == null || estado == null) {
            return ResponseEntity.badRequest().body("Fornecedor ID e Estado devem ser fornecidos.");
        }
        try {
            // Chama o serviço para processar a aprovação
            cotacaoService.alterarEstadoCotacao(id, cotacaoId, estado);
            return ResponseEntity.ok("Estado do item alterado com sucesso.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item não encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar a solicitação.");
        }

    }

//    @GetMapping("/buscar")
//    public ResponseEntity<List<ListagemCotacao>> buscarCotacoes(@RequestParam String label) {
//        List<ListagemCotacao> cotacoes = cotacaoService.buscarCotacao(label);
//        return ResponseEntity.ok(cotacoes);
//    }

    @GetMapping("/exportar/{fornecedorId}/{requisicaoId}")
    public ResponseEntity<ByteArrayResource> exportarCotacaoPorFornecedorERequisicao(
            @PathVariable Long fornecedorId,
            @PathVariable Long requisicaoId) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            String sheetName = "Orçamento_" + fornecedorId + "_" + requisicaoId + "_" +
                    LocalDateTime.now().toString().replace(":", "-").replace(".", "-");

            cotacaoCotacaoService.generatedExcel(fornecedorId, requisicaoId, outputStream);
            ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + sheetName + ".xls");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(resource.contentLength())
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}



