package org.example.mirinayapi.model.usuario;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.example.mirinayapi.model.permissao.AcaoPermissao;
import org.example.mirinayapi.model.permissao.Autorizacao;
import org.example.mirinayapi.model.permissao.Permissao;
import org.example.mirinayapi.model.permissao.UsuarioPermissao;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Date;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Table(name = "usuario")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Size(min = 2, max = 30)
    private String name;
    @Email
    @NotNull
    private String email;
    @NotNull
    private String password;
    private Boolean status;
//    @Enumerated(EnumType.STRING)
//    private Role role;

    private String telefone;
    private String gender;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Requisicao> requisicoes;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos;

    @ManyToOne
    @JoinColumn(name = "autorizacao_id")
    private Autorizacao autorizacao; // Apenas para referência estética

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<UsuarioPermissao> permissoes;

    public Usuario(String email) {
        this.email = email;
    }

//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(new SimpleGrantedAuthority(role.name()));
//    }
public Collection<? extends GrantedAuthority> getAuthorities() {
    return permissoes.stream()
            .filter(UsuarioPermissao::getPermitido)
            .map(usuarioPermissao -> {
                var acaoPermissao = usuarioPermissao.getAcaoPermissao();
                var permissao = acaoPermissao.getPermissao();
                String authority = acaoPermissao.getEndpoint().toUpperCase()+ "_" + acaoPermissao.getAcao();
                System.out.println("Autoridade: " + authority);
                return new SimpleGrantedAuthority(authority);
            })
            .collect(Collectors.toList());
}
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
