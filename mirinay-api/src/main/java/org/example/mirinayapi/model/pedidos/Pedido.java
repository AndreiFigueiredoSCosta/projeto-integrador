package org.example.mirinayapi.model.pedidos;

import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.condicaoPagamento.CondicaoPagamento;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.enums.pedido.StatusPedidoEnum;
import org.example.mirinayapi.model.enums.pedido.TipoFrete;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.nfe.Nfe;
import org.example.mirinayapi.model.transportadorCnpj.TransportadorCnpj;
import org.example.mirinayapi.model.unidade.Unidade;
import org.example.mirinayapi.model.usuario.Usuario;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pedidoID;

    private String nome;

    @CreationTimestamp
    private Date dataPedido;
    private Date dataPrevisao;
    private Date dataEntrega;

    private Boolean recebido;

    private TipoFrete frete;

    private BigDecimal valorFrete;

    private StatusPedidoEnum status;

    private Date dataAprovacao;

    @Column(updatable = false, name = "created_at")
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_cnpj_id")
    private FornecedorCnpj fornecedorCnpj;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transportador_cnpj_id")
    private TransportadorCnpj transportadorCnpj;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unidade_destino_id")
    private Unidade unidadeDestino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cotacao_id")
    private Cotacao cotacao;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "condicao_pagamento_id")
    private CondicaoPagamento condicaoPagamento;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nfe_id")
    private Nfe nfe;
}
