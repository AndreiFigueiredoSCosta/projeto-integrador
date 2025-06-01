package org.example.mirinayapi.controller;

import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.clonagem.DTO.*;
import org.example.mirinayapi.model.pedidos.DTO.ListagemIndicesPedidosPendentesDTO;
import org.example.mirinayapi.service.ClonagemService;
import org.example.mirinayapi.utils.SelectDTO;
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
@RequestMapping("/clonagem")
@CrossOrigin(origins = "*")
public class ClonagemController {
    private final ClonagemService service;
    private final PagedResourcesAssembler<ListaClonagemDTO> pagedResourcesAssemblera;

    public ClonagemController(ClonagemService service, PagedResourcesAssembler<ListaClonagemDTO> pagedResourcesAssemblera) {
        this.service = service;
        this.pagedResourcesAssemblera = pagedResourcesAssemblera;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Clonagem> create(@RequestBody CadastrarClonagemDTO clonagem) {
        return ResponseEntity.ok(service.create(clonagem));
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<ListaClonagemDTO>>> findAll(@RequestParam(defaultValue = "0") int page,
                                                                                               @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListaClonagemDTO> clonagens = service.findAll(pageable);
        if (clonagens.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        Page<ListaClonagemDTO> clonagemDTOPage = new PageImpl<>(clonagens, pageable, clonagens.size());
        PagedModel<EntityModel<ListaClonagemDTO>> pagedModel = pagedResourcesAssemblera.toModel(clonagemDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("{clonagemId}/similares")
    public ResponseEntity<List<Long>> findAllSimilares(
            @PathVariable("clonagemId") Long clonagemId
    ) {
        return ResponseEntity.ok(service.findAllSimilares(clonagemId));
    }

    //TODO: Implementar "/busca/produto?label={label}" por nome de produto ou id de produto presente em clonagens (Para pesquisar na barra de
    // pesquisa todas as clonagens que possuem um desses produtos)
    @GetMapping("/busca/produto")
    public ResponseEntity<List<ListaClonagemDTO>> findByProduto(@RequestParam String label) {
        List<ListaClonagemDTO> clonagens = service.findClonagemByProduto(label);
        if (clonagens.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(clonagens);
    }

    @GetMapping("/busca/similar")
    public ResponseEntity<List<ListaClonagemDTO>> findBySimilar(@RequestParam String label) {
        List<ListaClonagemDTO> clonagens = service.findClonagemBySimilar(label);
        if (clonagens.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(clonagens);
    }

    //TODO: Implementar "/busca/fornecedor?label={label}" por nome do fornecedor ou id do fornecedor presentes em clonagen  (Para pesquisar na
    // barra de pesquisa todas as clonagens que possuem esse fornecedor)

    @GetMapping("/busca/fornecedor")
    public ResponseEntity<List<ListaClonagemDTO>> findByFornecedor(@RequestParam String label) {
        List<ListaClonagemDTO> clonagens = service.findClonagemByFornecedor(label);
        if (clonagens.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(clonagens);
    }

    //TODO: Implementar "/busca/select?label={label}" por nome e código (Para quando se deseja adicionar qualquer clonagem a um item,
    // por ser novo e não estar ainda em uma clonagem ou simplesmente por escolha do usuario) (Retornará para um select)

    @GetMapping("/busca/select")
    public ResponseEntity<List<SelectDTO>> findByNomeOrId(@RequestParam String label) {
        List<SelectDTO> clonagens = service.findClonagemByNomeOrCodigo(label);
        if (clonagens.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(clonagens);
    }

    //TODO: Implementar "/busca/select?label={label}" por nome e código com base no id de um idSimilar (Para quando se sabe qual é o
    // idSimilar em uma cotação, necessitando retornar as clonagens que ele se encontra) (Retornará para um select)

    @GetMapping("/busca/select/{similarId}/similar")
    public ResponseEntity<List<ListaClonagemDTO>> findBySimilarId(@RequestParam Long label, @PathVariable Long similarId) {
        List<ListaClonagemDTO> clonagens = service.findClonagemBySimilarId(label);

        if (clonagens.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retorna 204 se nenhum dado for encontrado
        }

        return ResponseEntity.ok(clonagens);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clonagem> update(@PathVariable Long id, @RequestBody CadastrarClonagemDTO clonagem) {
        return ResponseEntity.ok(service.update(id, clonagem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


    @Deprecated
    @GetMapping("/detalhes/{id}")
    public ResponseEntity<DetalhesClonagemDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
}
