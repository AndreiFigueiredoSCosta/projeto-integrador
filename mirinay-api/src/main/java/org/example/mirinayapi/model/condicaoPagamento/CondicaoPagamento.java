package org.example.mirinayapi.model.condicaoPagamento;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

@Entity(name = "condicao_pagamento")
@Table(name = "condicao_pagamento")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CondicaoPagamento {
    @Id
    @GeneratedValue
    private Long condicaoPagamentoId;
    @NotBlank(message = "Nome da condição de pagamento não pode ser vazio")
    private String nome;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "condicaoPagamento", fetch = FetchType.LAZY)
    private List<Pedido> pedidos;
}
