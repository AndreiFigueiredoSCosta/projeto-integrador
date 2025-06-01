package org.example.mirinayapi.model.permissao;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "permissao")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Permissao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String modulo; // Exemplo: "Administração", "Compras"

    @ManyToMany
    @JoinTable(
            name = "autorizacao_permissao",
            joinColumns = @JoinColumn(name = "permissao_id"),
            inverseJoinColumns = @JoinColumn(name = "autorizacao_id")
    )
    private List<Autorizacao> autorizacoes;

    @OneToMany(mappedBy = "permissao", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<AcaoPermissao> acoes; // Ações permitidas (GET, POST, etc.)

}