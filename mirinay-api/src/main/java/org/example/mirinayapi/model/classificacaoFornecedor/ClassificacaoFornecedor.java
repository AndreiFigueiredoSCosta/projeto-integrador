package org.example.mirinayapi.model.classificacaoFornecedor;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity(name = "classificacao_fornecedor")
@Table(name = "classificacao_fornecedor")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ClassificacaoFornecedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "classificacao_fornecedor_id")
    private Long classificacaoFornecedorId;
    @NotNull(message = "Classificação deve ser informada de 1 a 5")
    private Integer classificacao;
    private String motivo;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;
    @OneToMany(mappedBy = "classificacaoFornecedor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemRequisicao> itemRequisicao;


}
