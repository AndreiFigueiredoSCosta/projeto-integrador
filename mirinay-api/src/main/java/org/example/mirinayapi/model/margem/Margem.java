package org.example.mirinayapi.model.margem;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table(name = "margem")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Margem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long margemId;

    @NotBlank
    @NotBlank(message = "Nome da margem não pode ser vazio")
    private String nome;

    @NotNull(message = "Valor da margem não pode ser vazio")
    private BigDecimal valorMargem;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    @JsonIgnore
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonIgnore
    private LocalDateTime updatedAt;

}
