package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.example.mirinayapi.model.grupo.dto.EditarGrupoDTO;
import org.example.mirinayapi.model.produto.DTO.ProdutoSimplesDTO;
import org.example.mirinayapi.model.subgrupo.SubGrupo;
import org.example.mirinayapi.model.subgrupo.dto.CadastrarSubgrupoDTO;
import org.example.mirinayapi.model.subgrupo.dto.EditarSubgrupoDTO;
import org.example.mirinayapi.model.subgrupo.dto.SubGrupoDTO;
import org.example.mirinayapi.service.SubGrupoService;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subgrupo")
@CrossOrigin(origins = "*")
public class SubGrupoController {
    private final SubGrupoService subgrupoService;

    public SubGrupoController(SubGrupoService subgrupoService) {
        this.subgrupoService = subgrupoService;
    }

    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrarSubGrupo(@RequestBody @Valid CadastrarSubgrupoDTO subgrupoDTO) {
        return this.subgrupoService.cadastrarSubGrupo(subgrupoDTO);
    }

    @GetMapping
    @Transactional
    public List<SubGrupoDTO> listarSubGrupos() {
        return this.subgrupoService.listarSubGrupos();
    }
    @GetMapping("/buscar/select")
    @Transactional
    public List<SelectDTO> listarSubGruposSelect(@RequestParam("label") String label) {
        return this.subgrupoService.listarSubGruposSelect(label);
    }

    @GetMapping("/detalhes/{id}")
    @Transactional
    public List<SubGrupoDTO> buscaSubGrupoPorId(@PathVariable Long id) {
        return this.subgrupoService.buscarSubGrupoPorId(id);
    }
    @GetMapping("/detalhes/{id}/produtos")
    @Transactional
    public ResponseEntity<?> buscaProdutosPorSubGrupoPorId(@PathVariable Long id) {
        return this.subgrupoService.buscaProdutosPorSubGrupoPorId(id);
    }


    @PutMapping("/editar")
    @Transactional
    public ResponseEntity<?> editarSubGrupo(@RequestBody EditarSubgrupoDTO subgrupo) {
        return this.subgrupoService.editarGrupo(subgrupo);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarSubGrupo(@PathVariable Long id) {
        return this.subgrupoService.excluirSubGrupo(id);
    }

}
