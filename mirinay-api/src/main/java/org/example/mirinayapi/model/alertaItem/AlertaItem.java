package org.example.mirinayapi.model.alertaItem;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;

@Entity
@Table(name = "alerta_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alerta_item_id")
    private Long alertaItemId;

    @Column(name = "descricao", length = 255)
    @NotBlank(message = "Descrição do alerta não pode ser vazia")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "item_requisicao_id", referencedColumnName = "item_requisicao_id")
    private ItemRequisicao itemRequisicao;

    public AlertaItem(String descricao, ItemRequisicao itemRequisicao) {
        this.descricao = descricao;
        this.itemRequisicao = itemRequisicao;
    }
}
