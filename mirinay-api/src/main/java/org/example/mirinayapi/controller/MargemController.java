package org.example.mirinayapi.controller;

import jakarta.transaction.Transactional;
import org.apache.catalina.connector.Response;
import org.example.mirinayapi.model.margem.Margem;
import org.example.mirinayapi.service.MargemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("/margem")
public class MargemController {

    public final MargemService margemService;

    public MargemController(MargemService margemService) {
        this.margemService = margemService;
    }

    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<Margem> cadastro(@RequestBody Margem margem) {
        return ResponseEntity.ok().body(margemService.cadastrarMargem(margem));
    }

    @GetMapping()
    public ResponseEntity<List<Margem>> listar() {
        return margemService.buscarMargem();
    }

    @GetMapping("/detalhes/{id}")
    public Margem detalhesPorId(@PathVariable Long id) {
        return margemService.buscarMargemPorId(id);
    }

    @PutMapping("/editar")
    @Transactional
    public Margem atualizar(@RequestBody Margem margem) {
        return margemService.editarMargem(margem);
    }

    @DeleteMapping("/deletar/{id}")
    @Transactional
    public void deletar(@PathVariable Long id) {
        margemService.excluirMarca(id);
    }

}
