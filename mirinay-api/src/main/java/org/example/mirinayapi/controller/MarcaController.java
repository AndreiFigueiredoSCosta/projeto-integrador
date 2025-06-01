package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.example.mirinayapi.model.grupo.dto.ListaSimplesGruposDTO;
import org.example.mirinayapi.model.marca.DTO.MarcaDTO;
import org.example.mirinayapi.model.marca.Marca;
import org.example.mirinayapi.service.MarcaService;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/marca")
@CrossOrigin(origins = "*")
public class MarcaController {

    private final MarcaService service;
    private final PagedResourcesAssembler<MarcaDTO> pagedResourcesAssembler2;

    public MarcaController(MarcaService service, PagedResourcesAssembler<MarcaDTO> pagedResourcesAssembler2) {
        this.service = service;
        this.pagedResourcesAssembler2 = pagedResourcesAssembler2;
    }

    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrarMarca(@RequestBody @Valid Marca marca, UriComponentsBuilder uriBuilder) {
        return this.service.cadastrarMarca(marca);
    }

    @GetMapping("{id}")
    @Transactional
    public Marca buscarMarcaPorId(@PathVariable Long id) {
        return this.service.buscarMarcaPorId(id);
    }

    @GetMapping
    @Transactional
    public ResponseEntity<PagedModel<EntityModel<MarcaDTO>>> buscarMarcas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MarcaDTO> marcas =  this.service.buscarMarcas(pageable);
        PagedModel<EntityModel<MarcaDTO>> marcasModel = pagedResourcesAssembler2.toModel(marcas);

        return ResponseEntity.ok(marcasModel);
    }

    @GetMapping("/buscar/select")
    public List<SelectDTO> listarMarcasPorNome(@RequestParam("label") String label) {
        return this.service.getMarcaSelect(label);
    }

    @PutMapping("/editar")
    @Transactional
    public ResponseEntity<?> editarMarca(@RequestBody Marca marca) {
        return this.service.editarMarca(marca);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarMarca(@PathVariable Long id) {
        return this.service.excluirMarca(id);
    }
}
