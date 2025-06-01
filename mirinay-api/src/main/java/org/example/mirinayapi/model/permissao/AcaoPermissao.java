package org.example.mirinayapi.model.permissao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "acao_permissao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AcaoPermissao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "permissao_id", nullable = false)
    private Permissao permissao;
    private String acao;
    private String endpoint;
    private String metodoHttp;
}
