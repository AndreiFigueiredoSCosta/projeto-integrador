package org.example.mirinayapi.controller;


import org.example.mirinayapi.model.orcamento.DTO.CadastroOrcamentoDTO;
import org.example.mirinayapi.model.orcamento.DTO.ExibirOrcamentoDTO;
import org.example.mirinayapi.model.orcamento.DTO.ListagemOrcamentoDTO;
import org.example.mirinayapi.model.orcamentoSimilar.DTO.AlterarOrcamentoSimilarDTO;
import org.example.mirinayapi.model.orcamentoSimilar.DTO.OrcamentoSimilarDTO;
import org.example.mirinayapi.service.OrcamentoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/orcamento")
@CrossOrigin(origins = "*")
public class OrcamentoController {
    private final OrcamentoService orcamentoService;
    private final PagedResourcesAssembler<ListagemOrcamentoDTO> pagedResourcesAssemblera;

    public OrcamentoController(
            OrcamentoService os,
            PagedResourcesAssembler<ListagemOrcamentoDTO> pr){
        this.pagedResourcesAssemblera = pr;
        this.orcamentoService = os;
    }

    //arrumar a paginaçao
    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<ListagemOrcamentoDTO>>> findAll(@RequestParam(defaultValue = "0") int page,
                                                                                 @RequestParam(defaultValue = "10") int size){
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemOrcamentoDTO> orcamentos = this.orcamentoService.findAll(pageable);
        if(orcamentos.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        Page<ListagemOrcamentoDTO> orcamentoDTOPage = new PageImpl<>(orcamentos, pageable, orcamentos.size());
        PagedModel<EntityModel<ListagemOrcamentoDTO>> pagedModel = pagedResourcesAssemblera.toModel(orcamentoDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    //Esse aqui é pra acessar os detalhes do orçamento
    @GetMapping("/{id}")
    public ExibirOrcamentoDTO exibirPeloId(@PathVariable Long id){
        try{
            return this.orcamentoService.exibirOrcamentoCompleto(id);
        }catch (Exception e){
            e.getMessage();
            return null;
        }
    }

    //esse é pra pesquisar pelo numero
    @GetMapping("/buscar/numero")
    public ResponseEntity<PagedModel<EntityModel<ListagemOrcamentoDTO>>> findByNumero(
            @RequestParam String label,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemOrcamentoDTO> orcamentos = this.orcamentoService.findById(Long.valueOf(label), pageable);
        if(orcamentos.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        Page<ListagemOrcamentoDTO> orcamentoDTOPage = new PageImpl<>(orcamentos, pageable, orcamentos.size());
        PagedModel<EntityModel<ListagemOrcamentoDTO>> pagedModel = pagedResourcesAssemblera.toModel(orcamentoDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("/buscar/vendedor")
    public ResponseEntity<PagedModel<EntityModel<ListagemOrcamentoDTO>>> findByVendedor(
                @RequestParam String label,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size){
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemOrcamentoDTO> orcamentos = this.orcamentoService.findByVendedor(label, pageable);
        if(orcamentos.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        Page<ListagemOrcamentoDTO> orcamentoDTOPage = new PageImpl<>(orcamentos, pageable, orcamentos.size());
        PagedModel<EntityModel<ListagemOrcamentoDTO>> pagedModel = pagedResourcesAssemblera.toModel(orcamentoDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("/buscar/cliente")
    public ResponseEntity<PagedModel<EntityModel<ListagemOrcamentoDTO>>> findByCliente(
                @RequestParam String label,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size){
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemOrcamentoDTO> orcamentos = this.orcamentoService.findByCliente(label, pageable);
        if(orcamentos.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        Page<ListagemOrcamentoDTO> orcamentoDTOPage = new PageImpl<>(orcamentos, pageable, orcamentos.size());
        PagedModel<EntityModel<ListagemOrcamentoDTO>> pagedModel = pagedResourcesAssemblera.toModel(orcamentoDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarOrcamento(@RequestBody CadastroOrcamentoDTO dadosOrcamento){
        try{
            return ResponseEntity.ok(this.orcamentoService.cadastrarOrcamento(dadosOrcamento));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{idOrcamento}/adicionarSimilar")
    public ResponseEntity<?> adicionarSimilarNoOrcamento(
            @RequestBody OrcamentoSimilarDTO dados,
            @PathVariable Long idOrcamento){
        try {
            return ResponseEntity.ok(this.orcamentoService.adicionarSimilarNoOrcamento(idOrcamento, dados));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{idOrcamento}/editarSimilar/{idSimilar}")
    public ResponseEntity<?> editarSimilarNoOrcamento(@PathVariable Long idOrcamento,
                                                      @PathVariable Long idSimilar,
                                                      @RequestBody AlterarOrcamentoSimilarDTO dados){
        try {
            return ResponseEntity.ok(this.editarSimilarNoOrcamento(
                    idOrcamento,
                    idSimilar,
                    dados
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{idOrcamento}/deletarSimilarDoOrcamento/{idSimilar}")
    public ResponseEntity<?> deletarSimilarNoOrcamento(@PathVariable Long idOrcamento,
                                                       @PathVariable Long idSimilar){
        try{
            return ResponseEntity.ok(this.deletarSimilarNoOrcamento(idOrcamento, idSimilar));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deletar/{idOrcamento}")
    public ResponseEntity<?> deletarOrcamento(@PathVariable Long idOrcamento){
        try {
            this.orcamentoService.deletarOrcamento(idOrcamento);
            return ResponseEntity.ok("Orçamento de id " + idOrcamento + " deletado com sucesso!" );
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
