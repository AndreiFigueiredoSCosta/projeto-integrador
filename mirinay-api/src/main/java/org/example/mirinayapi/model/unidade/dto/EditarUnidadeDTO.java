package org.example.mirinayapi.model.unidade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EditarUnidadeDTO(
        @NotNull(message = "O id é obrigatório")
        Long id,
        @Size(min = 3, max = 255, message = "O nome deve ter entre 3 e 255 caracteres")
        @NotNull(message = "O nome é obrigatório")
        @NotBlank(message = "O nome não pode ser vazio")
        String nome,
        @Size(min = 2, max = 10, message = "A sigla deve ter entre 2 e 10 caracteres")
        @NotNull(message = "A sigla é obrigatória")
        @NotBlank(message = "A sigla não pode ser vazia")
        String sigla) {
}
