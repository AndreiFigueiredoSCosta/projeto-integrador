package org.example.mirinayapi.controller;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.grupo.dto.ListaSimplesGruposDTO;
import org.example.mirinayapi.model.unidade.dto.CadastroUnidadeDTO;
import org.example.mirinayapi.model.unidade.dto.EditarUnidadeDTO;
import org.example.mirinayapi.model.unidade.dto.UnidadeDTO;
import org.example.mirinayapi.service.UnidadeService;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/unidade")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class UnidadeController {

    private final UnidadeService unidadeService;
    private final PagedResourcesAssembler<UnidadeDTO> pagedResourcesAssembler2;

    // Listar todas as unidades
    @GetMapping()
    public ResponseEntity<PagedModel<EntityModel<UnidadeDTO>>> listarUnidades(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UnidadeDTO> unidades = unidadeService.getAllUnidades(pageable);
        PagedModel<EntityModel<UnidadeDTO>> unidadesModel = pagedResourcesAssembler2.toModel(unidades);

        return ResponseEntity.ok(unidadesModel);
    }

    // Listar unidade por nome
    @GetMapping("/{id}")
    public ResponseEntity<?> listarUnidadePorId(@PathVariable Long id) {
        return unidadeService.getUnidade(id);
    }

    @GetMapping("/buscar/select")
    public List<SelectDTO> listarUnidadePorSigla(@RequestParam("label") String label) {
        return unidadeService.getUnidadeSelect(label);
    }

    // Deletar unidade
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUnidade(@PathVariable Long id) {
        return unidadeService.deleteUnidade(id);
    }

    // Cadastrar unidade
    @PostMapping("/cadastrar")
    public ResponseEntity<?> salvarUnidade(@RequestBody @Valid CadastroUnidadeDTO cadastroDTO) {
        return unidadeService.saveUnidade(cadastroDTO);
    }

    // Atualizar unidade
    @PutMapping("/editar")
    public ResponseEntity<?> atualizarUnidade(@RequestBody @Valid EditarUnidadeDTO editarUnidadeDTO) {
        return unidadeService.updateUnidade(editarUnidadeDTO);
    }

}
