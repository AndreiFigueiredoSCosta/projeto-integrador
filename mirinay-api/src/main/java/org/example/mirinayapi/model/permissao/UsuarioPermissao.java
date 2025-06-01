package org.example.mirinayapi.model.permissao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario_permissoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioPermissao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuario; // ID do usuário

    @ManyToOne
    @JoinColumn(name = "permissao_acao_id", nullable = false)
    private AcaoPermissao acaoPermissao;

    @Column(nullable = false)
    private Boolean permitido;
}

// Getters e Setters
