package org.example.mirinayapi.model.transportadorCnpj.dto;

public record ResponseFilialDTO(
        Long transportadorCnpjId,
        String nome,
        String cnpj,
        String telefone,
        String celular,
        String email,
        String tipo) {
}
