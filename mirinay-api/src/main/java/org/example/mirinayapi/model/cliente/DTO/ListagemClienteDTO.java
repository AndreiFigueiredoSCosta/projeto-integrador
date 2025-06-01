package org.example.mirinayapi.model.cliente.DTO;


import lombok.Builder;


@Builder
public record ListagemClienteDTO(
        Long id,
        String nomeCompleto,
        String cpf
) {
}
