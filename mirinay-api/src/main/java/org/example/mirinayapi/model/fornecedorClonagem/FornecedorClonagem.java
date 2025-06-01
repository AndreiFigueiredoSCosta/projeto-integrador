package org.example.mirinayapi.model.fornecedorClonagem;

import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.similar.Similar;


@Entity(name = "fornecedor_clonagem")
@Table(name = "fornecedor_clonagem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FornecedorClonagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fornecedor_clonagem_id")
    private Long fornecedorClonagemId;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @ManyToOne
    @JoinColumn(name = "clonagem_id")
    private Clonagem clonagem;
}
