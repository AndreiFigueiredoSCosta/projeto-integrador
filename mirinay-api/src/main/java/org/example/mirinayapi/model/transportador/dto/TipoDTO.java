package org.example.mirinayapi.model.transportador.dto;

public record TipoDTO(String tipo) {
    public TipoDTO {
        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo não pode ser nulo ou vazio");
        }
    }
}
