package org.example.mirinayapi.model.unidadePossui;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnidadePossuiId implements Serializable {
    @Column(name = "unidade_id")
    private Long unidadeId;
    @Column(name = "produto_id")
    private Long produtoId;
}
