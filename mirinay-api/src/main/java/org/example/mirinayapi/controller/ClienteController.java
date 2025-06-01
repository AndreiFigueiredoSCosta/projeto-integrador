package org.example.mirinayapi.controller;


import jakarta.validation.Valid;
import org.example.mirinayapi.model.cliente.DTO.ClienteDTO;
import org.example.mirinayapi.model.cliente.DTO.ExibirDetalhesClienteDTO;
import org.example.mirinayapi.model.cliente.DTO.ListagemClienteDTO;
import org.example.mirinayapi.service.ClienteService;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;


@RestController
@RequestMapping("/cliente")
@CrossOrigin(origins = "*")
public class ClienteController {
    private final ClienteService clienteService;
    private final PagedResourcesAssembler<ListagemClienteDTO> pagedResourcesAssemblera;

    public ClienteController(ClienteService clienteService, PagedResourcesAssembler<ListagemClienteDTO> pagedResourcesAssemblera) {
        this.clienteService = clienteService;
        this.pagedResourcesAssemblera = pagedResourcesAssemblera;
    }

    @GetMapping()
    public ResponseEntity<PagedModel<EntityModel<ListagemClienteDTO>>> findAll(@RequestParam(defaultValue = "0") int page,
                                                                               @RequestParam(defaultValue = "10") int size){
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemClienteDTO> clientes = this.clienteService.findAll(pageable);
        if(clientes.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        Page<ListagemClienteDTO> clienteDTOPage = new PageImpl<>(clientes, pageable, clientes.size());
        PagedModel<EntityModel<ListagemClienteDTO>> pagedModel = pagedResourcesAssemblera.toModel(clienteDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    //esse pra puxar acessar os detalhes
    @GetMapping("/{id}")
    public ExibirDetalhesClienteDTO findById(@PathVariable Long id){
       try {
           return this.clienteService.exibirClienteDetalhado(id);
       }catch (Exception e){
           e.getMessage();
       }
        return null;
    }

    //Pra pesquisar pelo numero
    @GetMapping("/buscar/numero")
    public ResponseEntity<PagedModel<EntityModel<ListagemClienteDTO>>> findByNumero(
            @RequestParam String label,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemClienteDTO> clientes = this.clienteService.findById(Long.valueOf(label), pageable);
        if(clientes.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        Page<ListagemClienteDTO> clienteDTOPage = new PageImpl<>(clientes, pageable, clientes.size());
        PagedModel<EntityModel<ListagemClienteDTO>> pagedModel = pagedResourcesAssemblera.toModel(clienteDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("/buscar/nome")
    public ResponseEntity<PagedModel<EntityModel<ListagemClienteDTO>>> findByNome(
            @RequestParam String label,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemClienteDTO> clientes = this.clienteService.findByNome(label, pageable);
        if(clientes.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        Page<ListagemClienteDTO> clienteDTOPage = new PageImpl<>(clientes, pageable, clientes.size());
        PagedModel<EntityModel<ListagemClienteDTO>> pagedModel = pagedResourcesAssemblera.toModel(clienteDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("/buscar/cpf")
    public ResponseEntity<PagedModel<EntityModel<ListagemClienteDTO>>> findByCpf(
            @RequestParam String label,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        List<ListagemClienteDTO> clientes = this.clienteService.findByCpf(label, pageable);
        if(clientes.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        Page<ListagemClienteDTO> clienteDTOPage = new PageImpl<>(clientes, pageable, clientes.size());
        PagedModel<EntityModel<ListagemClienteDTO>> pagedModel = pagedResourcesAssemblera.toModel(clienteDTOPage);
        return ResponseEntity.ok(pagedModel);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarCliente (@RequestBody @Valid ClienteDTO cliente) {
        try {
            return ResponseEntity.ok(this.clienteService.cadastrarCliente(cliente));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/editar")
    public ResponseEntity<?> editarCliente (
            @RequestBody @Valid ClienteDTO cliente) {
        try {
            return ResponseEntity.ok(this.clienteService.alterarCliente(cliente));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletarCliente (@PathVariable Long id){
        try {
            this.clienteService.excluirCliente(id);
            return ResponseEntity.ok("Cliente deletado com sucesso");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

