package org.example.mirinayapi.model.transportadorCnpj.dto;

import org.example.mirinayapi.model.enums.FornecedorEnum;

public record CadastroFilialDTO(
        String cnpj,
        String nome,
        FornecedorEnum tipo,
        String telefone,
        String email,
        String celular) {
}
