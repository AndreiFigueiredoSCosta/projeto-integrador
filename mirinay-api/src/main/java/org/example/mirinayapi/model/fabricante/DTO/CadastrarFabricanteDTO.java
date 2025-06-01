package org.example.mirinayapi.model.fabricante.DTO;

import org.example.mirinayapi.model.endereco.DTO.CadastrarEnderecoDTO;
import org.example.mirinayapi.model.endereco.Endereco;
import org.example.mirinayapi.model.fabricante.Fabricante;

public record CadastrarFabricanteDTO(
        String nome,
        String descricao,
        String telefone,
        String email,
        CadastrarEnderecoDTO endereco
) {

    public Fabricante fabricanteDTOtoFabricante (Endereco e) {
        Fabricante fabricante = new Fabricante();
        fabricante.setNome(nome);
        fabricante.setDescricao(descricao);
        fabricante.setTelefone(telefone);
        fabricante.setEmail(email);
        fabricante.setEndereco(e);

        return fabricante;
    }

}
