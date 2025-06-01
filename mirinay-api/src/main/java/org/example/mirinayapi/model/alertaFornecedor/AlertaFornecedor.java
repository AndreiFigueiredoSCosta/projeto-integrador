package org.example.mirinayapi.model.alertaFornecedor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;


@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AlertaFornecedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertaFornecedorId;

    @NotBlank(message = "Descrição do alerta não pode ser vazia")
    private String descricao;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    public AlertaFornecedor(String descricao, Fornecedor fornecedor) {
        this.descricao = descricao;
        this.fornecedor = fornecedor;
    }
}
