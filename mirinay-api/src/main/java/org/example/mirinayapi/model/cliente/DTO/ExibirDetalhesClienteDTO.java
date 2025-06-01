package org.example.mirinayapi.model.cliente.DTO;


import lombok.Builder;
import java.util.Date;


@Builder
public record ExibirDetalhesClienteDTO(
        Long clienteId,
        String nomeCompleto,
        String cpf,
        String email,
        String telefone,
        String nascimento
) {
}
