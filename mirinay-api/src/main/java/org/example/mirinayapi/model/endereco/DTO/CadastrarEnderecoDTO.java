package org.example.mirinayapi.model.endereco.DTO;

import org.example.mirinayapi.model.endereco.Endereco;

public record CadastrarEnderecoDTO(
        String cep,
        String numero,
        String cidade,
        String bairro,
        String uf) {
    public Endereco toEndereco() { // Transforma um DTO de enderço para um objeto de endereço
        Endereco endereco = new Endereco();

        endereco.setCep(cep);
        endereco.setNumero(numero);
        endereco.setCidade(cidade);
        endereco.setBairro(bairro);
        endereco.setUf(uf);

        return endereco;
    }
}