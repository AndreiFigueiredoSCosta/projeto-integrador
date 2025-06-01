package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.cotacao.DTO.ListagemCotacaoConcluidas;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.itemRequisicao.DTO.*;
import org.example.mirinayapi.model.itemRequisicao.DTO.aprovacao.ListagemItensRequisicaoAprovacaoDTO;
import org.example.mirinayapi.model.requisicao.DTO.CadastrarRequisicaoDTO;
import org.example.mirinayapi.model.requisicao.DTO.EditarRequisicaoDTO;
import org.example.mirinayapi.model.requisicao.DTO.ListagemRequisicaoDTO;
import org.example.mirinayapi.service.ItemRequisicaoService;
import org.example.mirinayapi.service.RequisicaoService;
import org.example.mirinayapi.service.cotacao.CotacaoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requisicao")
@CrossOrigin(origins = "*")
public class RequisicaoController {

    private final RequisicaoService service;
    private final ItemRequisicaoService itemRequisicaoService;
    private final CotacaoService cotacaoService;
    private final PagedResourcesAssembler<ListagemCotacaoConcluidas> pagedResourcesAssembler;
    public RequisicaoController(RequisicaoService service, ItemRequisicaoService itemRequisicaoService, CotacaoService cotacaoService, PagedResourcesAssembler<ListagemCotacaoConcluidas> pagedResourcesAssembler) {
        this.service = service;
        this.itemRequisicaoService = itemRequisicaoService;
        this.cotacaoService = cotacaoService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    //--SUMARIO---//
    @GetMapping()
    public List<ListagemRequisicaoDTO> listagem (@RequestParam String destino) {
        switch (destino.toUpperCase()) {
            case "VENDA":
                return service.buscarRequisicoesNaoConcluidasDestinoVenda();

            case "ESTOQUE":
                return service.buscarRequisicoesNaoConcluidasDestinoEstoque();

            case "VENDA/ESTOQUE":
                return service.buscarRequisicoesNaoConcluidasDestinoVendaEstoque();
        }
        return List.of();
    }
    @PostMapping("/cadastrar")
    @Transactional
    public void cadastrarRequisicao(@RequestHeader("Authorization") String authorizationHeader, @RequestBody CadastrarRequisicaoDTO requisicaoDTO) {
        String token = authorizationHeader.replace("Bearer ", "");

        this.service.cadastrarRequisicao(token, requisicaoDTO);
    }
    @GetMapping("/concluido")
    public Page<ListagemRequisicaoDTO> buscarConcluidasPaginadas(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanho) {
        return service.buscarRequisicoesConcluidasPaginadas(pagina, tamanho).map(
                requisicao -> new ListagemRequisicaoDTO(
                        requisicao.getRequisicaoId(),
                        requisicao.getNome(),
                        requisicao.getUsuario().getName(),
                        requisicao.getCliente(),
                        requisicao.getObservacao(),
                        requisicao.getDestino(),
                        requisicao.getPrioridade(),
                        requisicao.getEstagio()
                        )
        );
    }


    @GetMapping("/buscar")
    public List<ListagemRequisicaoDTO> buscarRequisicoes (@RequestParam String label,@RequestParam String destino) {
        switch (destino.toUpperCase()) {
            case "VENDA":
                return service.pesquisarRequisicoesNaoConcluidasDestinoVenda(label);

            case "ESTOQUE":
                return service.pesquisarRequisicoesNaoConcluidasDestinoEstoque(label);

            case "VENDA/ESTOQUE":
                return service.pesquisarRequisicoesNaoConcluidasDestinoVendaEstoque(label);
        }
        return List.of();
    }

    @GetMapping("/concluido/buscar")
    public ResponseEntity<PagedModel<EntityModel<ListagemCotacaoConcluidas>>> buscarRequisicoesConcluidas(
            @RequestParam String label,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    )
    {
        Pageable pageable = PageRequest.of(page, size);
        List<ListagemCotacaoConcluidas> cotacoesConcluidas = service.buscarRequisicoesConcluidas(label ,pageable);
        return getPagedModelResponseEntity(pageable, cotacoesConcluidas, pagedResourcesAssembler);
    }

    static ResponseEntity<PagedModel<EntityModel<ListagemCotacaoConcluidas>>> getPagedModelResponseEntity(Pageable pageable, List<ListagemCotacaoConcluidas> cotacoesConcluidas, PagedResourcesAssembler<ListagemCotacaoConcluidas> pagedResourcesAssembler) {
        Page<ListagemCotacaoConcluidas> cotacoesConcluidasPage = new PageImpl<>(cotacoesConcluidas, pageable, cotacoesConcluidas.size());
        if (cotacoesConcluidasPage.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            PagedModel<EntityModel<ListagemCotacaoConcluidas>> pagedModel = pagedResourcesAssembler.toModel(cotacoesConcluidasPage);

            return ResponseEntity.ok(pagedModel);
        }
    }


    // -------------- DETALHES -------------- //

    @GetMapping("/detalhes/{id}")
    public ListagemRequisicaoDTO buscarRequisicaoPorId( @PathVariable Long id) {
        return service.buscarRequisicaoPorId(id);
    }

    @PutMapping("/detalhes/{id}/avancar")
    @Transactional
    public void avancarEstagio(@PathVariable Long id, @RequestParam EstagioEnum estagio) {
        this.service.avancarEstagio(id, estagio);
    }

    @PutMapping("/detalhes/{id}/editar")
    @Transactional
    public void editarRequisicao(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Long id, @RequestBody EditarRequisicaoDTO requisicaoDTO) {
        String token = authorizationHeader.replace("Bearer ", "");

        this.service.editarRequisicao(token, id, requisicaoDTO);
    }

    @DeleteMapping("/detalhes/{id}/excluir")
    @Transactional
    public void deletarRequisicao(@PathVariable Long id) {
        this.service.deletarRequisicao(id);
    }





    // -------------- REQUISICAO CONSTRUÇÃO -------------- //

    @PostMapping("/detalhes/{id}/construcao/inserir")
    public ResponseEntity<?> construcaoInserir (@RequestBody CadastrarConstrucaoDTO construcaoDTO, @PathVariable Long id) {
        try {
            System.out.println("Entrou no try");
            System.out.println("ID: " + id+ " DTO: " + construcaoDTO.referencia()+ " " + construcaoDTO.quantidade()+ " " + construcaoDTO.observacao());
            return this.itemRequisicaoService.construcaoInserir(construcaoDTO, id);
        } catch (Exception e) {
            e.printStackTrace();
            return this.itemRequisicaoService.construcaoInserir(construcaoDTO, id);
        }
    }

    @PutMapping("/detalhes/{requisicaoId}/construcao/editar")
    public void construcaoEditar (@RequestBody EditarItemRequisicaoDTO construcaoDTO, @PathVariable Long requisicaoId) throws BadRequestException {
        this.itemRequisicaoService.construcaoEditar(construcaoDTO, requisicaoId);
    }

    @DeleteMapping("/detalhes/{id}/construcao/{itemId}/excluir")
    public void construcaoExcluir (@PathVariable Long itemId) {
        this.itemRequisicaoService.construcaoExcluir(itemId);
    }

    @GetMapping("/detalhes/{id}/construcao")
    public List<ListagemItensRequisicaoConstrucaoDTO> construcaoListar (@PathVariable Long id) {
        return this.itemRequisicaoService.construcaoListar(id);
    }

    // -------------- REQUISICAO COTAÇÃO -------------- //

    @PostMapping("/detalhes/{id}/cotacao/inserir")
    public void cotacaoInserir (@RequestBody InserirItemEmFaseCotacaoDTO cotacaoDTO, @PathVariable Long id) throws BadRequestException {
        this.itemRequisicaoService.cotacaoInserir(cotacaoDTO, id);
    }

    @GetMapping("/detalhes/{id}/cotacao")
    public List<ListagemItensRequisicaoCotacaoDTO> cotacaoListar (@PathVariable Long id) {
        return this.itemRequisicaoService.cotacaoListar(id);
    }

    @PostMapping("/detalhes/{id}/cotacao/addAlerta")
    public void aprovacaoAddAlerta (@RequestBody CadastrarAlertaDTO alertaDTO, @PathVariable Long id) throws BadRequestException {
        this.itemRequisicaoService.CotacaoAddAlerta(alertaDTO, id);
    }

    // -------------- REQUISICAO APROVAÇÃO -------------- //

    @PutMapping("/detalhes/{id}/aprovacao/alterar")
    public void aprovacaoAlterar (@RequestBody EditarAprovacaoDTO aprovacaoDTO , @PathVariable Long id) {
        this.itemRequisicaoService.aprovacaoAlterar(aprovacaoDTO, id);
    }


    @GetMapping("/detalhes/{id}/aprovacao")
    public List<ListagemItensRequisicaoAprovacaoDTO> aprovacaoListar (@PathVariable Long id) {
        EstagioEnum estagioEnum = EstagioEnum.APROVACAO;
        return this.itemRequisicaoService.ItensListar(id, estagioEnum);
    }

    // -------------- REQUISICAO PEDIDO -------------- //

    @GetMapping("/detalhes/{id}/pedido")
    public List<ListagemItensRequisicaoAprovacaoDTO> pedidoListar (@PathVariable Long id) {
        EstagioEnum estagioEnum = EstagioEnum.PEDIDO;
        return this.itemRequisicaoService.ItensListar(id, estagioEnum);
    }

    // -------------- REQUISICAO CONCLUIDO -------------- //

    @GetMapping("/detalhes/{id}/concluido")
    public List<ListagemItensRequisicaoAprovacaoDTO> entregaListar (@PathVariable Long id) {
        EstagioEnum estagioEnum = EstagioEnum.CONCLUIDO;
        return this.itemRequisicaoService.ItensListar(id, estagioEnum);
    }

}
