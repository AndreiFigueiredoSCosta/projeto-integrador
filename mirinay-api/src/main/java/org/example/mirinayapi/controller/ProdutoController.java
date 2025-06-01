package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.grupo.dto.GruposProdutosDTO;
import org.example.mirinayapi.model.produto.DTO.CadastroProdutoDTO;
import org.example.mirinayapi.model.produto.DTO.DetalhesProdutoDTO;
import org.example.mirinayapi.model.produto.DTO.ProdutoSimplesDTO;
import org.example.mirinayapi.model.similar.DTO.SubmitSimilarDTO;
import org.example.mirinayapi.model.similar.DTO.SimilarDetalhesDTO;
import org.example.mirinayapi.service.ProdutoService;
import org.example.mirinayapi.service.RequisicaoService;
import org.example.mirinayapi.service.SimilarService;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/produto")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService service;
    private final PagedResourcesAssembler<ProdutoSimplesDTO> pagedResourcesAssembler;
    private final SimilarService similarService;
    private final RequisicaoService requisicaoService;

    //TODO: Adicionar checagem de nome nulo ou vazio ou muito curto ou repetido
    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrarProduto(@RequestBody @Valid CadastroProdutoDTO produto, UriComponentsBuilder uriBuilder) throws BadRequestException {
        return this.service.cadastrarProduto(produto);
    }

    //TODO: Adicionar checagem de referência nula, ou vazia ou muito curta
    //TODO: Checar por referências repetidas
    @PostMapping("/cadastrar/similar/{id}")
    @Transactional
    public ResponseEntity<?> cadastrarProdutoSimilar(@PathVariable Long id, @RequestBody @Valid SubmitSimilarDTO produto, UriComponentsBuilder uriBuilder) {
      try {
        return this.similarService.cadastrarProdutoSimilar(produto, id);
      } catch (Exception e) {
          e.printStackTrace();
        return ResponseEntity.badRequest().build();
      }
    }

    @PostMapping("/inserirComponente/{id}/componente/{idComponente}")
    @Transactional
    public ResponseEntity<?> inserirProdutoComponente(@PathVariable Long id, @PathVariable Long idComponente) {
        try {
            service.inserirProdutoComponente(id, idComponente);
            return ResponseEntity.ok("Componente adicionado ao produto com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao processar a requisição.");
        }
    }

    @DeleteMapping("/removerComponente/{produtoId}/componente/{componenteId}")
    @Transactional
    public ResponseEntity<?> removerProdutoComponente(@PathVariable Long produtoId, @PathVariable Long componenteId) {
        try {
            service.removerProdutoComponente(produtoId, componenteId);
            return ResponseEntity.ok("Componente removido do produto com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao processar a requisição.");
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<GruposProdutosDTO>> buscarProdutosPorNomeOuCodigo(
            @RequestParam("label") String label) {

        List<GruposProdutosDTO> resultado = service.buscarProdutosPorNomeOuCodigo(label);

        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(resultado);
    }
    @GetMapping("/buscar/select")
    public ResponseEntity<List<SelectDTO>> buscarProdutosPorNomeOuCodigoSelect(
            @RequestParam("label") String label) {

        List<SelectDTO> resultado = service.buscarProdutosPorNomeOuCodigoSelect(label);

        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/buscar/similar/select")
    public ResponseEntity<List<SelectDTO>> buscarSimilaresPorNomeOuCodigoSelect(
            @RequestParam("label") String label) {

        List<SelectDTO> resultado = service.buscarSimlaresPorNomeOuCodigoSelect(label);

        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/detalhes/{id}")
    @Transactional
    public ResponseEntity<DetalhesProdutoDTO> buscarDetalheProduto(@PathVariable Long id){
        List<DetalhesProdutoDTO> produto = service.buscarDetalhesProduto(id);

        if (produto.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(produto.get(0));
        }
    }


    @GetMapping("/detalhes/{id}/similares")
    @Transactional
    public ResponseEntity<List<SimilarDetalhesDTO>> buscarProdutoPorId(@PathVariable Long id) {
        System.out.println(id);
        return ResponseEntity.ok(service.buscarProdutoPorId(id));
    }

    @GetMapping
    @Transactional
    public ResponseEntity<PagedModel<EntityModel<ProdutoSimplesDTO>>> buscarProdutos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        List<ProdutoSimplesDTO> produtosList = service.listarProdutos(pageable);

        Page<ProdutoSimplesDTO> produtosPage = new PageImpl<>(produtosList, pageable, produtosList.size());
        PagedModel<EntityModel<ProdutoSimplesDTO>> produtosModel = pagedResourcesAssembler.toModel(produtosPage);

        return ResponseEntity.ok(produtosModel);
    }

    @GetMapping("/detalhes/{id}/componentes")
    @Transactional
    public ResponseEntity<List<ProdutoSimplesDTO>> buscarComponentesProduto(@PathVariable Long id){
        List<ProdutoSimplesDTO> produto = service.buscarProdutosComponentes(id);

        return ResponseEntity.ok(produto);
    }
    @GetMapping("/detalhes/{id}/conjuntos")
    @Transactional
    public ResponseEntity<List<ProdutoSimplesDTO>> buscarProdutosConjuntosEComponentes(@PathVariable Long id) {
        return service.buscarConjuntosQueProdutoFazParte(id);
    }

    @GetMapping("/detalhes/{similarId}/similar/clonagens/buscar")
    public ResponseEntity<List<SelectDTO>> buscarClonagensDeSimilar(@PathVariable Long similarId) {
        return ResponseEntity.ok(service.buscarClonagensDeSimilar(similarId));
    }

    //TODO: Adicionar checagem de nome nulo ou vazio ou muito curto ou repetido, mas ter em mente que o nome do produto atual também é checada no exists
    @PutMapping("/editar/{id}")
    @Transactional
    public ResponseEntity<?> editarProduto(@PathVariable Long id, @RequestBody CadastroProdutoDTO produto) {
        return ResponseEntity.ok().body(this.service.editarProduto(id, produto));
    }

    //TODO: Adicionar checagem de referência nula, ou vazia ou muito curta
    //TODO: Checar por referências repetidas, mas ter em mente que a referência do idSimilar atual também é checada no exists
    @PutMapping("/editar/similar/{id}")
    @Transactional
    public ResponseEntity<?> editarProdutoSimilar(@RequestBody SubmitSimilarDTO produto, @PathVariable Long id) {
        this.similarService.editarProdutoSimilar(produto, id);
        return ResponseEntity.ok().body(produto);
    }

    @DeleteMapping("{id}")
    @Transactional
    public ResponseEntity<?> deletarProduto(@PathVariable Long id) {
        this.service.excluirProduto(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/similar/{id}")
    @Transactional
    public ResponseEntity<?> deletarProdutoSimilar(@PathVariable Long id) {
        this.similarService.excluirProdutoSimilar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/similar/{id}")
    public ResponseEntity<SimilarDetalhesDTO> buscarProdutosSimilares(@PathVariable Long id) {
        return ResponseEntity.ok(similarService.buscarSimilarPorId(id));
    }

    @GetMapping("/{produtoId}/estoque-requisicoes")
    public ResponseEntity<Map<String, Object>> consultarEstoqueERequisicoes(@PathVariable Long produtoId) {
        Map<String, Object> resultado = requisicaoService.consultarEstoqueERequisicoesPorProduto(produtoId);
        return ResponseEntity.ok(resultado);
    }


    @GetMapping("/{produtoId}")
    public ResponseEntity<Map<String, Object>> consultarGraficos(@PathVariable Long produtoId) {
        Map<String, Object> dadosGraficos = requisicaoService.consultarDadosGraficos(produtoId);
        return ResponseEntity.ok(dadosGraficos);
    }
}
