package org.example.mirinayapi.model.permissao;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.mirinayapi.model.permissao.Permissao;

import java.util.List;

@Entity
@Table(name = "autorizacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Autorizacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;

    @ManyToMany
    @JoinTable(
            name = "autorizacao_permissao",
            joinColumns = @JoinColumn(name = "autorizacao_id"),
            inverseJoinColumns = @JoinColumn(name = "permissao_id")
    )
    private List<Permissao> permissoesAssociadas;

}
