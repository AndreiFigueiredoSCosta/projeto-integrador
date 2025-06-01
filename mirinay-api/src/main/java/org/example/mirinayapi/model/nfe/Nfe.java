package org.example.mirinayapi.model.nfe;

import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.pedidos.Pedido;

import java.util.List;

@Entity(name = "nfe")
@Table(name = "nfe")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Nfe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nfeId;
    String numeroNfe;
    String chaveAcesso;
    Boolean encontrado;
    String xml;
    String valorTotal;

    @OneToMany(mappedBy = "nfe", fetch = FetchType.LAZY)
    private List<Pedido> pedidos;
}
