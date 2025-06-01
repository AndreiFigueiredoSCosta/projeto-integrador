package org.example.mirinayapi.model.orcamentoSimilar;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.orcamento.Orcamento;
import org.example.mirinayapi.model.similar.Similar;

import java.math.BigDecimal;


@Entity(name = "orcamento_similar")
@Table(name = "orcamento_similar")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrcamentoSimilar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orcamento_similar_id")
    private Long orcamentoSimilarId;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "orcamento_id", nullable = false)
    private Orcamento orcamento;
    @ManyToOne
    @JoinColumn(name = "similar_id", nullable = false)
    private Similar similar;
    private int quantidade;
    @Column(name = "valor_atacado")
    private BigDecimal valorAtacado;
    @Column(name = "valor_varejo")
    private BigDecimal valorVarejo;
    @ManyToOne
    @JoinColumn(name = "cotacao_id")
    private Cotacao cotacao;
    @Column(name = "tipo_de_maquina")
    private String tipoDeMaquina;
    @Column(name = "marca_da_maquina")
    private String marcaDaMaquina;
}
