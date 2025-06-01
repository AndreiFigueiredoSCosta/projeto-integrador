package org.example.mirinayapi.model.fornecedorCnpj.DTO;

import org.example.mirinayapi.model.enums.FornecedorEnum;

public record EditarFornecedorCnpjDTO(
        Long id,
        String nome,
        String cidade,
        String estado,
        FornecedorEnum tipo,
        String cnpj,
        String telefone,
        String email,
        Long fornecedorId
) {

}