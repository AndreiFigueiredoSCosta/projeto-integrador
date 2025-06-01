package org.example.mirinayapi.service;


import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.cliente.Cliente;
import org.example.mirinayapi.model.cliente.DTO.ClienteDTO;
import org.example.mirinayapi.model.cliente.DTO.ExibirDetalhesClienteDTO;
import org.example.mirinayapi.model.cliente.DTO.ListagemClienteDTO;
import org.example.mirinayapi.model.cliente.repositories.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;


@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<ListagemClienteDTO> findAll(Pageable pageable){
        Page<Cliente> clientes = this.clienteRepository.findAll(pageable);
        if (clientes.isEmpty()){
            return List.of();
        }

        return clientes.stream().map(
                cliente -> {
                    return ListagemClienteDTO.builder()
                            .id(cliente.getClienteId())
                            .nomeCompleto(cliente.getNomeCompleto())
                            .cpf(cliente.getCpf())
                            .build();
                }
        ).toList();
    }

    public List<ListagemClienteDTO> findById(Long id, Pageable pageable){
        Page<Cliente> clientes = this.clienteRepository.findByClienteId(id, pageable);
        if (clientes.isEmpty()){
            return List.of();
        }

        return clientes.stream().map(
                cliente -> {
                    return ListagemClienteDTO.builder()
                            .id(cliente.getClienteId())
                            .nomeCompleto(cliente.getNomeCompleto())
                            .cpf(cliente.getCpf())
                            .build();
                }
        ).toList();
    }

    public List<ListagemClienteDTO> findByNome(String nome, Pageable pageable){
        Page<Cliente> clientes = this.clienteRepository.findByNomeCompletoContainingIgnoreCase(nome, pageable);
        if (clientes.isEmpty()){
            return List.of();
        }

        return clientes.stream().map(
                cliente -> {
                    return ListagemClienteDTO.builder()
                            .id(cliente.getClienteId())
                            .nomeCompleto(cliente.getNomeCompleto())
                            .cpf(cliente.getCpf())
                            .build();
                }
        ).toList();
    }

    public List<ListagemClienteDTO> findByCpf(String cpf, Pageable pageable){
        Page<Cliente> clientes = this.clienteRepository.findByCpfContainingIgnoreCase(cpf, pageable);
        if (clientes.isEmpty()){
            return List.of();
        }

        return clientes.stream().map(
                cliente -> {
                    return ListagemClienteDTO.builder()
                            .id(cliente.getClienteId())
                            .nomeCompleto(cliente.getNomeCompleto())
                            .cpf(cliente.getCpf())
                            .build();
                }
        ).toList();
    }

    public ExibirDetalhesClienteDTO exibirClienteDetalhado(Long id) {
        Cliente cliente = this.clienteRepository.findClienteByClienteId(id);
        if (cliente == null){
            throw new RuntimeException("Cliente não encontrado!");
        }

        return new ExibirDetalhesClienteDTO(
                cliente.getClienteId(),
                cliente.getNomeCompleto(),
                cliente.getCpf(),
                cliente.getEmail(),
                cliente.getTelefone(),
                cliente.getNascimento()
        );
    }

    public Cliente cadastrarCliente(ClienteDTO dadosCliente){
        Cliente novoCliente = Cliente.builder()
                .nomeCompleto(dadosCliente.nomeCompleto())
                .cpf(dadosCliente.cpf())
                .email(dadosCliente.email())
                .telefone(dadosCliente.telefone())
                .nascimento(dadosCliente.nascimento())
                .build();

        this.clienteRepository.save(novoCliente);
        return novoCliente;
    }

    public Cliente alterarCliente(ClienteDTO dadosCliente) throws BadRequestException {
        Cliente cliente = this.clienteRepository.findClienteByClienteId(dadosCliente.clienteId());
        if (cliente == null) {
            throw new BadRequestException("Cliente não encontrado!");
        }

        cliente.setNomeCompleto(dadosCliente.nomeCompleto());
        cliente.setEmail(dadosCliente.email());
        cliente.setCpf(dadosCliente.cpf());
        cliente.setTelefone(dadosCliente.telefone());
        cliente.setNascimento(dadosCliente.nascimento());
        this.clienteRepository.save(cliente);
        return cliente;
    }

    public void excluirCliente(Long id) throws BadRequestException {
        Cliente cliente = this.clienteRepository.findClienteByClienteId(id);
        if (cliente == null) {
            throw new BadRequestException("Cliente não encontrado!");
        }

        this.clienteRepository.delete(cliente);
    }

}
