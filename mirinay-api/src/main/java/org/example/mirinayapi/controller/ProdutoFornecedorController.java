package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.example.mirinayapi.model.fornecedorClonagem.DTO.CadastrarFornecedorClonagemDTO;
import org.example.mirinayapi.model.fornecedorClonagem.DTO.ListagemFornecedorClonagem;
import org.example.mirinayapi.model.produtoFornecedor.DTO.*;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;
import org.example.mirinayapi.model.produtoClonagem.DTO.CadastrarProdutoClonagemDTO;
import org.example.mirinayapi.model.produtoClonagem.DTO.ListagemProdutoClonagem;
import org.example.mirinayapi.model.produtoClonagem.DTO.ListagemSimilaresProdutoFornecedor;
import org.example.mirinayapi.service.ProdutoFornecedorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/itemClonagem")
@CrossOrigin(origins = "*")
public class ProdutoFornecedorController {

    private final ProdutoFornecedorService service;

    public ProdutoFornecedorController(ProdutoFornecedorService service) {
        this.service = service;
    }

    //Retorna todos os produtos de uma clonagem
    @GetMapping("/{clonagemId}/produto")
    public ResponseEntity<List<ListagemProdutoClonagem>> findProdutosClonagem(
            @PathVariable("clonagemId") Long clonagemId
    ) {
        return ResponseEntity.ok(service.findProdutosClonagemId(clonagemId));
    }

    //Retorna todos os similares de um produto de uma clonagem específica
    @GetMapping("/{clonagemId}/produto/{produtoId}")
    @Transactional
    public List<ListagemSimilaresProdutoFornecedor> listarSimilaresDeProduto(
            @PathVariable("produtoId") Long produtoId,
            @PathVariable("clonagemId") Long clonagemId
    ) {
        return this.service.listarSimilaresDeProduto(clonagemId, produtoId);
    }

    //Retorna todos os fornecedores de uma clonagem
    @GetMapping("/{clonagemId}/fornecedor")
    public ResponseEntity<List<ListagemFornecedorClonagem>> findFornecedoresClonagem(
            @PathVariable("clonagemId") Long clonagemId
    ) {
        return ResponseEntity.ok(service.findFornecedoresClonagemId(clonagemId));
    }

    // Cadastra um(todos os) idSimilar(es) de um produto em uma clonagem
    @PostMapping("/cadastrar/produto")
    @Transactional
    public ResponseEntity<?> cadastrarProduto(@RequestBody @Valid CadastrarProdutoClonagemDTO produtoClonagem) {
        return this.service.cadastrarProduto(produtoClonagem);
    }

    // Cadastra um fornecedor em uma clonagem
    @PostMapping("/cadastrar/fornecedor")
    @Transactional
    public ResponseEntity<?> cadastrarFornecedor(@RequestBody @Valid CadastrarFornecedorClonagemDTO fornecedorClonagem) {
        return this.service.cadastrarFornecedor(fornecedorClonagem);
    }


    @DeleteMapping("/{clonagemId}/fornecedor/{fornecedorId}")
    @Transactional
    public ResponseEntity<?> deletarFornecedor(
            @PathVariable("fornecedorId") Long fornecedorId,
            @PathVariable("clonagemId") Long clonagemId
    ) {
        return this.service.deletarFornecedor(fornecedorId, clonagemId);
    }


    @DeleteMapping("/{clonagemId}/produto/{produtoId}")
    @Transactional
    public ResponseEntity<?> deletarProduto(
            @PathVariable("produtoId") Long produtoId,
            @PathVariable("clonagemId") Long clonagemId
    ) {
        return this.service.deletarProduto(produtoId, clonagemId);
    }

    @DeleteMapping("/{clonagemId}/similar/{similarId}")
    @Transactional
    public ResponseEntity<?> deletarSimilar(
            @PathVariable("similarId") Long similarId,
            @PathVariable("clonagemId") Long clonagemId
    ) {
        return this.service.deletarSimilar(similarId, clonagemId);
    }


    @Deprecated
    @DeleteMapping("/{codigo}")
    @Transactional
    public void deletarProdutoFornecedor(@PathVariable Long codigo) {
        this.service.deletarProdutoFornecedor(codigo);
    }

    @Deprecated
    @PutMapping("/editar")
    @Transactional
    public void editarGrupoProdutoFornecedor (@RequestBody EditarProdutoFornecedorDTO grupoFornecedor) {
        this.service.editarProdutoFornecedor(grupoFornecedor);
    }

    @Deprecated
    @GetMapping("/listarProdutosFornecedores")
    @Transactional
    public List<ListagemGrupoProdutoFornecedor> listarGrupoProdutoFornecedores() {
        return this.service.listarProdutosFornecedores();
    }

    @Deprecated
    @GetMapping("/{codigo}")
    @Transactional
    public Optional<ProdutoFornecedor> listarProdutoFornecedor (@PathVariable Long codigo) {
        return this.service.listarProdutoFornecedor(codigo);
    }
}
