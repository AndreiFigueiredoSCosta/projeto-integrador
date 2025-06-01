package org.example.mirinayapi.service;

import org.example.mirinayapi.model.endereco.Endereco;
import org.example.mirinayapi.model.fabricante.DTO.CadastrarFabricanteDTO;
import org.example.mirinayapi.model.fabricante.DTO.EditarFabricanteDTO;
import org.example.mirinayapi.model.fabricante.Fabricante;
import org.example.mirinayapi.model.fabricante.repositories.FabricanteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FabricanteService {

    private final FabricanteRepository repository;
    private final EnderecoService enderecoService;

    public FabricanteService(FabricanteRepository repository, EnderecoService enderecoService) {
        this.repository = repository;
        this.enderecoService = enderecoService;
    }

    public void cadastrarFabricante(CadastrarFabricanteDTO fabricante) {
        Endereco endereco = this.enderecoService.cadastrarEndereco(fabricante.endereco());
        this.repository.save(fabricante.fabricanteDTOtoFabricante(endereco));
    }

    public void editarFabricante(EditarFabricanteDTO fabricante) {

        this.enderecoService.editarEndereco(fabricante.endereco()); // Função para editar o endereço

        Fabricante fabricante_banco = this.repository.getReferenceById(fabricante.codigo());

        fabricante_banco.setNome(fabricante.nome());
        fabricante_banco.setDescricao(fabricante.descricao());
        fabricante_banco.setTelefone(fabricante.telefone());
        fabricante_banco.setEmail(fabricante.email());

        this.repository.save(fabricante_banco);
    }

    public void deletarFabricante(Long codigo) {
        Fabricante fabricante = this.repository.getReferenceById(codigo);
        this.enderecoService.deletarEndereco(fabricante.getEndereco().getEnderecoId());
        this.repository.deleteById(fabricante.getFabricanteId());

        // fazer a função para deletar todos os produtos
    }

    public List<Fabricante> buscarFabricantes() {
        return repository.findAll();
    }

    public Fabricante buscarFabricantePorId(Long id) {
        return this.repository.findById(id).orElse(null);
    }

}
