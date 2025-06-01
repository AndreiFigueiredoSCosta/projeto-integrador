package org.example.mirinayapi.model.fabricante.DTO;

import org.example.mirinayapi.model.endereco.DTO.EditarEnderecoDTO;

public record EditarFabricanteDTO(
        Long codigo,
        String nome,
        String descricao,
        String telefone,
        String email,
        EditarEnderecoDTO endereco
) {
}
