package org.example.mirinayapi.model.unidade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CadastroUnidadeDTO (
        @NotNull(message = "O nome é obrigatório")
        @NotBlank(message = "O nome não pode ser vazio")
                @Size(min = 3, max = 255, message = "O nome deve ter entre 3 e 255 caracteres")
        String nome,
        @NotNull(message = "A sigla é obrigatória")
        @NotBlank(message = "A sigla não pode ser vazia")
        @Size(min = 2, max = 10, message = "A sigla deve ter entre 2 e 10 caracteres")
        String sigla){}
