package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.fornecedorCnpj.DTO.CadastrarFornecedorCnpjDTO;
import org.example.mirinayapi.model.fornecedorCnpj.DTO.EditarFornecedorCnpjDTO;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.service.FornecedorCnpjService;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/fornecedorcnpj")
@CrossOrigin(origins = "*")
public class FornecedorCnpjController {
    private final FornecedorCnpjService service;

    public FornecedorCnpjController(FornecedorCnpjService service) {
        this.service = service;
    }

    @GetMapping("/{fornecedorId}/fornecedor")
    public ResponseEntity<List<Long>> listarFornecedores(@PathVariable Long fornecedorId) {
        return ResponseEntity.ok(this.service.getCNPJIdFromFornecedor(fornecedorId));
    }

    @GetMapping("/detalhes/{id}")
    @Transactional
    public FornecedorCnpj buscarFornecedorPorCodigo(@PathVariable Long id) {
        return this.service.getCNPJbyId(id);
    }

    @PostMapping("/cadastrar")
    @Transactional
    public void cadastrarFornecedor(@RequestBody @Valid CadastrarFornecedorCnpjDTO fornecedor) {
        this.service.cadastrarFornecedor(fornecedor);
    }

    @GetMapping("/buscar/select/{fornecedorId}/cnpj")
    public ResponseEntity<List<SelectDTO>> getSelectCNPJsByFornecedorId(
            @PathVariable Long fornecedorId,
            @RequestParam(value = "label", required = false) String label
    ) throws BadRequestException {
        List<SelectDTO> cnpjs = this.service.getSelectCNPJsByFornecedorId(label, fornecedorId);

        if (cnpjs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.ok(cnpjs);
    }

    @PutMapping("/editar")
    @Transactional
    public void editarFornecedor (@RequestBody EditarFornecedorCnpjDTO fornecedor) {
        this.service.editarFornecedor(fornecedor);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deletarFornecedor(@PathVariable Long id) {
        this.service.deletarFornecedor(id);
    }

    @PostMapping("/tornarMatriz/{id}")
    @Transactional
    public void tornarMatriz(@PathVariable Long id) {
        this.service.tornarMatriz(id);
    }
}
