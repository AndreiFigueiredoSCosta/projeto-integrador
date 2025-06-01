package org.example.mirinayapi.model.cliente.DTO;


import jakarta.validation.constraints.NotBlank;
import lombok.Builder;


@Builder
public record ClienteDTO(
        Long clienteId,
        @NotBlank
        String nomeCompleto,
        @NotBlank
        String cpf,
        @NotBlank
        String email,
        @NotBlank
        String telefone,
        @NotBlank
        String nascimento
) {
}
