package org.example.mirinayapi.controller;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.transportador.Transportador;
import org.example.mirinayapi.model.transportador.dto.CadastroTranportadorDTO;
import org.example.mirinayapi.model.transportador.dto.ResponseTransportador;
import org.example.mirinayapi.model.transportadorCnpj.TransportadorCnpj;
import org.example.mirinayapi.model.transportadorCnpj.dto.CadastroFilialDTO;
import org.example.mirinayapi.model.transportadorCnpj.dto.ResponseFilialDTO;
import org.example.mirinayapi.service.TransportadorService;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transportador")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class TransportadorController {

    private final TransportadorService transportadorService;
    private final PagedResourcesAssembler<ResponseTransportador> pagedResourcesAssembler;

    // Cadastrar novo transportador
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarTransportador(@RequestBody CadastroTranportadorDTO cadastroDTO) {
        return transportadorService.cadastrarTransportador(cadastroDTO);
    }

    // Cadastrar filial de transportador
    @PostMapping("/cadastrar/{idTransportador}/cnpjs")
    public ResponseEntity<?> cadastrarTransportadorFilial(
            @RequestBody CadastroFilialDTO cadastroDTO,
            @PathVariable Long idTransportador) {
                System.out.println("Entrou no cadastrarTransportadorFilial");
                System.out.println("cadastroDTO: " + cadastroDTO);
        return transportadorService.cadastrarTransportadorFilial(cadastroDTO, idTransportador);
    }

    // Listar transportadores com paginação
    @GetMapping()
    public PagedModel<EntityModel<ResponseTransportador>> listarTransportadores(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<ResponseTransportador> responseTransportador = transportadorService.listarTransportadores(pageable);

        return pagedResourcesAssembler.toModel(responseTransportador);
    }

    // Listar filiais de um transportador com paginação
    @GetMapping("/detalhes/{idTransportador}/cnpj")
    public ResponseEntity<List<ResponseFilialDTO>> listarFiliais(
            @PathVariable Long idTransportador
    ) {
        List<ResponseFilialDTO> responseFilialDTO = transportadorService.listarTransportadoresFiliais(idTransportador);
        return ResponseEntity.ok(responseFilialDTO);
    }

    @GetMapping("/detalhes/{id}")
    public ResponseEntity<Transportador> buscarTransportadorPorId(@PathVariable Long id) {
        return transportadorService.buscarTransportadorPorId(id);
    }

    // Buscar uma filial de transportador por ID
    @GetMapping("/{idTransportador}/cnpj/{idFilial}")
    public ResponseEntity<TransportadorCnpj> buscarTransportadorFilialPorId(
            @PathVariable Long idTransportador,
            @PathVariable Long idFilial) {
        return transportadorService.buscarTransportadorFilialPorId(idTransportador, idFilial);
    }

    // Atualizar transportador
    @PutMapping("/editar")
    public ResponseEntity<Transportador> atualizarTransportador(
            @RequestBody CadastroTranportadorDTO cadastroDTO) {
        return transportadorService.atualizarTransportador(cadastroDTO);
    }

    // Atualizar filial de transportador
    @PutMapping("/editar/cnpj/{idFilial}")
    public ResponseEntity<TransportadorCnpj> atualizarTransportadorFilial(
            @PathVariable Long idFilial,
            @RequestBody CadastroFilialDTO cadastroFilialDTO) {
        return transportadorService.atualizarTransportadorFilial(idFilial, cadastroFilialDTO);
    }

    @PostMapping("/trocarTipo/{id}")
    public ResponseEntity<?> atualizarTipoTransportador(@PathVariable Long id) {
        transportadorService.atualizarTipoTransportador(id);
        return ResponseEntity.ok().build();
    }


    // Deletar transportador
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTransportador(@PathVariable Long id) {
        return transportadorService.deletarTransportador(id);
    }

    // Deletar filial de transportador
    @DeleteMapping("/deletar/cnpj/{idFilial}")
    public ResponseEntity<Void> deletarTransportadorFilial(
            @PathVariable Long idFilial) {
        return transportadorService.deletarTransportadorFilial(idFilial);
    }

    @GetMapping("/buscar/select")
    public List<SelectDTO> buscarTipos(@RequestParam String label) {
        return transportadorService.buscarTransportadorSelect(label);
    }
    //TODO: Implementar método "/buscar/select/cnpj" para buscar filiais para um select através do cnpj

    //TODO: Implementar método "/buscar/select/{transportadorId}/cnpj" para buscar filiais de um transportador específico
    // para um select através do cnpj

    //TODO: Implementar método "/buscar/cnpj" para buscar transportadores com um cnpj específico nas suas filiais/matriz

    //TODO: Implementar método "/buscar" para buscar transportador por nome
}
