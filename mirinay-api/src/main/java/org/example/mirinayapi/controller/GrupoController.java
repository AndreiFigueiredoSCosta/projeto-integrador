package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.example.mirinayapi.model.grupo.Grupo;
import org.example.mirinayapi.model.grupo.dto.CadastrarGrupoDTO;
import org.example.mirinayapi.model.grupo.dto.EditarGrupoDTO;
import org.example.mirinayapi.model.grupo.dto.GrupoDetalhesDTO;
import org.example.mirinayapi.model.grupo.dto.ListaSimplesGruposDTO;
import org.example.mirinayapi.model.subgrupo.dto.SubGrupoDTO;
import org.example.mirinayapi.service.GrupoService;
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
@RequestMapping("/grupo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GrupoController {

    private final GrupoService grupoService;
    private final PagedResourcesAssembler<ListaSimplesGruposDTO> pagedResourcesAssembler2;

    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrarGrupo(@RequestBody @Valid @NotNull CadastrarGrupoDTO grupoDTO) {
        return this.grupoService.cadastrarGrupo(grupoDTO);
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<ListaSimplesGruposDTO>>> listagemSimples(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<ListaSimplesGruposDTO> grupos = grupoService.listarGruposSimples(pageable);
        PagedModel<EntityModel<ListaSimplesGruposDTO>> gruposModel = pagedResourcesAssembler2.toModel(grupos);

        return ResponseEntity.ok(gruposModel);
    }

    @GetMapping("detalhes/{id}")
    @Transactional
    public GrupoDetalhesDTO buscaGrupoPorId(@PathVariable Long id) {
        return this.grupoService.buscarGrupoPorId(id);
    }

    @GetMapping("detalhes/{id}/subgrupos")
    @Transactional
    public ResponseEntity<List<SubGrupoDTO>> buscaSubgruposPorIdGrupo(@PathVariable Long id) {
        return this.grupoService.buscaSubgruposPorIdGrupo(id);
    }


    @GetMapping("/buscar")//
    public ResponseEntity<PagedModel<EntityModel<ListaSimplesGruposDTO>>> buscarGruposSimples(
            @RequestParam(value = "label", required = false) String label,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        if (label == null || label.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<ListaSimplesGruposDTO> grupos = grupoService.buscarGrupos(label, pageable);
        PagedModel<EntityModel<ListaSimplesGruposDTO>> gruposModel = pagedResourcesAssembler2.toModel(grupos);

        return ResponseEntity.ok(gruposModel);
    }

    @GetMapping("/buscar/select")//
    public ResponseEntity<?> buscarGruposSelect(
            @RequestParam(value = "label", required = false) String label){
        if (label == null || label.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Label não pode ser vazia.");
        }
        List<SelectDTO> grupos = grupoService.buscarGruposSimplesSelect(label);

        if (grupos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(grupos);
    }

    @PutMapping("/editar")
    @Transactional
    public ResponseEntity<?> editarGrupo(@RequestBody EditarGrupoDTO grupoDTO) {
        return this.grupoService.editarGrupo(grupoDTO);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarGrupo(@PathVariable Long id) {
        return this.grupoService.excluirGrupo(id);
    }




//    @GetMapping("/all")
//    public ResponseEntity<PagedModel<EntityModel<ListaGruposDTO>>> listarGrupos(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
//    ) {
//        Pageable pageable = PageRequest.of(page, size);
//        Page<ListaGruposDTO> grupos = grupoService.listarGrupos(pageable);
//        PagedModel<EntityModel<ListaGruposDTO>> gruposModel = pagedResourcesAssembler.toModel(grupos);
//
//        return ResponseEntity.ok(gruposModel);
//    }

    //    @GetMapping("/buscar1")
//    public ResponseEntity<String> buscarGrupos(
//            @RequestParam(value = "alerta", required = false) String label,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
//    ){
//        if (label == null || label.isBlank()) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body("Descrição não pode ser vazia.");
//        }
//        Pageable pageable = PageRequest.of(page, size);
////        Page<ListaGruposDTO> grupos = grupoService.buscarGruposPorNome(label, pageable);
//        PagedModel<EntityModel<ListaGruposDTO>> gruposModel = pagedResourcesAssembler.toModel(grupos);
//
//        if (grupos.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
//        }
//        return ResponseEntity.ok(grupos.toString());
//    }
}
