package org.example.mirinayapi.controller;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.pedidos.DTO.*;
import org.example.mirinayapi.service.PedidoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedido")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService service;
    private final PagedResourcesAssembler<ListagemIndicesPedidosPendentesDTO> pagedResourcesAssembler;
    private final PagedResourcesAssembler<ListagemPedidosConcluidosDTO> pagedResourcesAssemblerConcluidos;


    @PostMapping("/gerar")
    public void gerarController(@RequestHeader("Authorization") String authorizationHeader, @RequestBody GerarDTO gerarDTO) {
        String token = authorizationHeader.replace("Bearer ", "");
        service.criarPedido(token, gerarDTO);
    }

    @GetMapping("/pendentes")
    public ResponseEntity<PagedModel<EntityModel<ListagemIndicesPedidosPendentesDTO>>> listarPedidosPendentes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemIndicesPedidosPendentesDTO> pedidos = service.listarPedidosPendentes(pageable);
        Page<ListagemIndicesPedidosPendentesDTO> pedidos1 = new PageImpl <> (pedidos, pageable, pedidos.size());
        if (pedidos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        PagedModel<EntityModel<ListagemIndicesPedidosPendentesDTO>> pagedModel = pagedResourcesAssembler.toModel(pedidos1);

        return ResponseEntity.ok(pagedModel);
    }
    @GetMapping("/pendentes/buscar")
    public ResponseEntity<PagedModel<EntityModel<ListagemIndicesPedidosPendentesDTO>>> buscarPedidosPendentes(
            @RequestParam String label,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemIndicesPedidosPendentesDTO> pedidos = service.buscarPedidosPendentes(label, pageable);
        Page<ListagemIndicesPedidosPendentesDTO> pedidos1 = new PageImpl <> (pedidos, pageable, pedidos.size());
        if (pedidos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        PagedModel<EntityModel<ListagemIndicesPedidosPendentesDTO>> pagedModel = pagedResourcesAssembler.toModel(pedidos1);

        return ResponseEntity.ok(pagedModel);
    }
    @GetMapping("/pendentes/{id}")
    public ResponseEntity<List<ListagemItensPedidosPendentesDTO>> buscarPedidoPendentePorId(@PathVariable Long id) {
        List<ListagemItensPedidosPendentesDTO> pedido = service.buscarPedidoPendentePorId(id);
        return ResponseEntity.ok(pedido);
    }

    @GetMapping("/efetuados")
    public ResponseEntity<PagedModel<EntityModel<ListagemPedidosConcluidosDTO>>> listarPedidosConcluidos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemPedidosConcluidosDTO> pedidos = service.listarPedidosConcluidos(pageable);
        Page<ListagemPedidosConcluidosDTO> pedidos1 = new PageImpl <> (pedidos, pageable, pedidos.size());
        if (pedidos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        PagedModel<EntityModel<ListagemPedidosConcluidosDTO>> pagedModel = pagedResourcesAssemblerConcluidos.toModel(pedidos1);

        return ResponseEntity.ok(pagedModel);
    }
    @GetMapping("/concluido/buscar")
    public ResponseEntity<PagedModel<EntityModel<ListagemPedidosConcluidosDTO>>> buscarPedidosConcluidos(
            @RequestParam String label,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemPedidosConcluidosDTO> pedidos = service.buscarPedidosConcluidos(label, pageable);
        Page<ListagemPedidosConcluidosDTO> pedidos1 = new PageImpl <> (pedidos, pageable, pedidos.size());
        if (pedidos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        PagedModel<EntityModel<ListagemPedidosConcluidosDTO>> pagedModel = pagedResourcesAssemblerConcluidos.toModel(pedidos1);

        return ResponseEntity.ok(pagedModel);
    }

    @PostMapping("/concluidos/{id}/recebido")
    public ResponseEntity<String> marcarPedidoRecebido(@PathVariable Long id) {
        try {
            service.marcarPedidoRecebido(id);
            return ResponseEntity.ok("Pedido marcado como recebido");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Pedido não encontrado");
        }
    }

    @GetMapping("/detalhes/{id}")
    public ResponseEntity<ListagemRequisicaoPedidoDTO> buscarPedidoDetalhePorId(@PathVariable Long id) {
        try {
          ListagemRequisicaoPedidoDTO pedido = service.buscarPedidoDetalhePorId(id);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/detalhes/{id}/itens")
    public ResponseEntity<List<ListagemItensPedidosPendentesDTO>> buscarItensPedidoPorId(@PathVariable Long id) throws Exception {
        try {
            List<ListagemItensPedidosPendentesDTO> pedido = service.buscarItensPedidoPorId(id);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

//    @PutMapping("/detalhes/{id}/editar")
//    public ResponseEntity<String> editarPedido(@PathVariable Long id, @RequestBody EditarPedidoDTO editarPedidoDTO) {
//        try {
//            service.editarPedido(id, editarPedidoDTO);
//            return ResponseEntity.ok("Pedido editado com sucesso");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Erro ao editar pedido");
//        }
//    }
//
//    @DeleteMapping("/detalhes/{id}/excluir")
//    public ResponseEntity<String> excluirPedido(@PathVariable Long id) {
//        try {
//            service.excluirPedido(id);
//            return ResponseEntity.ok("Pedido excluído com sucesso");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Erro ao excluir pedido");
//        }
//    }
}
