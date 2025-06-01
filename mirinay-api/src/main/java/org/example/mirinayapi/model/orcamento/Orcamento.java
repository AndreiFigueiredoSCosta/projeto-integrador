package org.example.mirinayapi.model.orcamento;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.orcamentoSimilar.OrcamentoSimilar;
import org.example.mirinayapi.model.cliente.Cliente;
import org.example.mirinayapi.model.usuario.Usuario;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;


@Entity(name = "orcamento")
@Table(name = "orcamento")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Orcamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orcamento_id")
    private Long orcamentoId;
    @ManyToOne
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Usuario vendedor;
    @Column(name = "valor_total")
    private BigDecimal valorTotal;
    @Temporal(TemporalType.DATE)
    @Column(name = "data_orcamento")
    private Date dataOrcamento;
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    @JsonManagedReference
    @OneToMany(mappedBy = "orcamento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrcamentoSimilar> orcamentoSimilar;
}
