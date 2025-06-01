package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.example.mirinayapi.model.fornecedorCnpj.DTO.DetalhesFornecedorDTO;
import org.example.mirinayapi.model.fornecedor.DTO.*;
import org.example.mirinayapi.service.FornecedorService;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/fornecedor")
@CrossOrigin(origins = "*")
public class FornecedorController {
    private final FornecedorService service;
    private final PagedResourcesAssembler<ListagemFornecedorDTO> pagedResourcesAssembler;
    private final PagedResourcesAssembler<SimplesFornecedor> pagedResourcesAssembler1;

    public FornecedorController(FornecedorService service, PagedResourcesAssembler<ListagemFornecedorDTO> pagedResourcesAssembler, PagedResourcesAssembler<SimplesFornecedor> pagedResourcesAssembler1) {
        this.service = service;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.pagedResourcesAssembler1 = pagedResourcesAssembler1;
    }

    //TODO: Implementar checagem de nome repetido
    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrarFornecedor(@RequestBody @Valid CadastrarFornecedorDTO grupoFornecedor) {
        try {
            this.service.cadastrarFornecedor(grupoFornecedor);
            return ResponseEntity.ok().build();
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/editar")
    @Transactional
    public ResponseEntity<?> editarProdutoFornecedor (@RequestBody EditarFornecedorDTO grupoFornecedor) {
        try {
            this.service.editarFornecedor(grupoFornecedor);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deletarFornecedor(@PathVariable Long id) {
        this.service.deletarFornecedor(id);
    }

    @GetMapping
    @Transactional
    public ResponseEntity<PagedModel<EntityModel<SimplesFornecedor>>> listarFornecedoresSimples(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SimplesFornecedor> gruposFornecedores = this.service.listarFornecedoresSimples(pageable);
        PagedModel<EntityModel<SimplesFornecedor>> gruposFornecedoresModel = pagedResourcesAssembler1.toModel(gruposFornecedores);

        return ResponseEntity.ok(gruposFornecedoresModel);
    }

    @GetMapping("/detalhes/{id}")
    @Transactional
    public SimplesFornecedor buscarGrupoFornecedorPorCodigo (@PathVariable Long id) {
        return this.service.buscarFornecedor(id);
    }

    @GetMapping("/detalhes/{id}/cnpj")
    @Transactional
    public List<DetalhesFornecedorDTO> listarGruposFornecedor (@PathVariable Long id) {
        return this.service.listarGrupoFornecedor(id);
    }

    //TODO: Implementar método "/buscar/nome" para buscar pelo nome dos forncedores
    //TODO: Implementar método "/buscar/cnpj" para buscar pelo cnpj dos cnpjs dos forncedores
    //TODO: Implementar método "/buscar/cnpj/nome" para buscar pelo nome dos cnpjs dos forncedores
    //TODO: Implementar método "/buscar/{fornecedorId}/nome" para buscar pelo nome dos cnpjs de um forncedor específico
    //TODO: Implementar método "/buscar/{fornecedorId}/cnpj" para buscar pelo cnpj dos cnpjs de um forncedor específico

    @GetMapping("/buscar/select")
    public ResponseEntity<List<SelectDTO>> listarFornecedoresPorNome(
            @RequestParam(value = "label", required = false) String label
    ) {
        List<SelectDTO> gruposFornecedores = this.service.listarFornecedoresPorNome(label);

        if (gruposFornecedores.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.ok(gruposFornecedores);
    }

    @Deprecated
    @GetMapping("/listarFornecedores")
    @Transactional
    public ResponseEntity<PagedModel<EntityModel<ListagemFornecedorDTO>>> listarFornecedores(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ListagemFornecedorDTO> gruposFornecedores = this.service.listarFornecedores(pageable);
        PagedModel<EntityModel<ListagemFornecedorDTO>> gruposFornecedoresModel = pagedResourcesAssembler.toModel(gruposFornecedores);

        return ResponseEntity.ok(gruposFornecedoresModel);
    }
}
