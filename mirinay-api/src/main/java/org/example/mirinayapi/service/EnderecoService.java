package org.example.mirinayapi.service;

import org.example.mirinayapi.model.endereco.DTO.CadastrarEnderecoDTO;
import org.example.mirinayapi.model.endereco.DTO.EditarEnderecoDTO;
import org.example.mirinayapi.model.endereco.Endereco;
import org.example.mirinayapi.model.endereco.repositories.EnderecoRepository;
import org.springframework.stereotype.Service;

@Service
public class EnderecoService {
    private final EnderecoRepository repository;

    public EnderecoService(EnderecoRepository repository) {
        this.repository = repository;
    }

    public Endereco cadastrarEndereco(CadastrarEnderecoDTO endereco) {
        Endereco enderecoSalvo = this.repository.save(endereco.toEndereco()); // Tranforma o dto de Endeco em um objeto de Endereco e ao salvar retorna o objeto salvo
        return enderecoSalvo;
    }

    public void editarEndereco(EditarEnderecoDTO endereco) {
        Endereco endereco_banco = this.repository.getReferenceById(endereco.codigo());

        endereco_banco.setNumero(endereco.numero());
        endereco_banco.setCidade(endereco.cidade());
        endereco_banco.setUf(endereco.uf());
        endereco_banco.setBairro(endereco.bairro());
        endereco_banco.setCep(endereco.cep());

        this.repository.save(endereco_banco);
    }

    public void deletarEndereco(Long codigo) {
        this.repository.deleteById(codigo);
    }
}
