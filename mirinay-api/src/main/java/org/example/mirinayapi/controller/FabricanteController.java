package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.example.mirinayapi.model.fabricante.DTO.CadastrarFabricanteDTO;
import org.example.mirinayapi.model.fabricante.DTO.EditarFabricanteDTO;
import org.example.mirinayapi.model.fabricante.Fabricante;
import org.example.mirinayapi.service.FabricanteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fabricante")
@CrossOrigin(origins = "*")
public class FabricanteController {

    private final FabricanteService service;
    public FabricanteController(FabricanteService service) {
        this.service = service;
    }

    @PostMapping("/cadastrarFabricante")
    @Transactional
    public void cadastrarFabricante(@RequestBody @Valid CadastrarFabricanteDTO fabricante) {
        this.service.cadastrarFabricante(fabricante);
    }

    @PutMapping("/editarFabricante")
    @Transactional
    public void editarFabricante(@RequestBody EditarFabricanteDTO fabricante) {
        this.service.editarFabricante(fabricante);
    }

    @DeleteMapping("{codigo}")
    @Transactional
    public void deletarFabricante(@PathVariable Long codigo) {
        this.service.deletarFabricante(codigo);
    }

    @GetMapping
    @Transactional
    public List<Fabricante> buscarFabricantes() {
        return this.service.buscarFabricantes();
    }

    @GetMapping("{id}")
    @Transactional
    public Fabricante buscarFabricantePorId(@PathVariable Long id) {
        return this.service.buscarFabricantePorId(id);
    }
}
