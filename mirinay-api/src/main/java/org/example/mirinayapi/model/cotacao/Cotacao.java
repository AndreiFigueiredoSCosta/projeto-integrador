package org.example.mirinayapi.model.cotacao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.itemPedido.ItemPedido;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.margem.Margem;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "cotacao")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Cotacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cotacaoId;

    @Column(name = "valor_unitario", precision = 10, scale = 2)
    private BigDecimal valorUnitario;

    @Column(name = "ipi", precision = 10, scale = 2)
    private BigDecimal ipi;

    private BigDecimal st;

    private Boolean difal;

    private BigDecimal tempoEntrega;


    @NotNull(message = "Quantidade deve ser informada")
    private Integer quantidade;

    private String observacao;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    @JsonIgnore
    private java.sql.Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonIgnore
    private java.sql.Date updatedAt;

    @Column(name = "ultima_cotacao")
    @JsonIgnore
    private java.sql.Date ultimaCotacao;

    @Enumerated(EnumType.STRING)
    private EstadoItemEnum estadoCotacao;

    @ManyToOne
    @JoinColumn(name = "item_requisicao_id")
    @JsonIgnore
    private ItemRequisicao itemRequisicao;

    @ManyToOne
    @JoinColumn(name = "fornecedor_cnpj_id")
    @JsonIgnore
    private FornecedorCnpj fornecedorCnpj;

    @ManyToOne
    @JoinColumn(name = "requisicao_id")
    @JsonIgnore
    private Requisicao requisicao;

    @ManyToOne
    @JoinColumn(name = "margem_id")
    private Margem margem;

    @OneToMany(mappedBy = "cotacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Pedido> pedidos;


//    @ManyToOne
//    @JoinColumn(name = "margem_id")
//    private Margem margem;

        //    @OneToMany(mappedBy = "fornecedorCnpj", cascade = CascadeType.ALL, orphanRemoval = true)
        //    @JsonIgnore
        //    private List<Cotacao> cotacoes;

}
