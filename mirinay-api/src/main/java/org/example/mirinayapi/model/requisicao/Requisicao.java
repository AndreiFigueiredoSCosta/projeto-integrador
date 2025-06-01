package org.example.mirinayapi.model.requisicao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.requisicao.DTO.ListagemRequisicaoDTO;
import org.example.mirinayapi.model.unidade.Unidade;
import org.example.mirinayapi.model.usuario.Usuario;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity(name = "requisicao")
@Table(name = "requisicao")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Requisicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requisicao_id")
    private Long requisicaoId;

    @NotBlank(message = "Nome da requisição não pode ser vazio")
    private String nome;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    private Boolean status;
    @NotBlank(message = "Cliente da requisição não pode ser vazio")
    private String cliente;
    @NotBlank(message = "Observação da requisição não pode ser vazia")
    private String observacao;

    @Enumerated(EnumType.STRING)
    private DestinoEnum destino;

    @Enumerated(EnumType.STRING)
    private PrioridadeEnum prioridade;

    @Enumerated(EnumType.STRING)
    private EstagioEnum estagio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unidade_id", nullable = false)
    private Unidade unidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "requisicao", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ItemRequisicao> itensRequisicao;

    @OneToMany(mappedBy = "requisicao", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Cotacao> cotacoes;

    public Requisicao(String nome, Date createdAt, Date updatedAt, String cliente, String observacao, DestinoEnum destino, PrioridadeEnum prioridade, EstagioEnum estagio, Unidade unidade, Usuario usuario, Boolean status) {
        this.nome = nome;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.cliente = cliente;
        this.observacao = observacao;
        this.destino = destino;
        this.prioridade = prioridade;
        this.estagio = estagio;
        this.unidade = unidade;
        this.usuario = usuario;
        this.status = status;
    }

    public final List<ListagemRequisicaoDTO> requisicaoParaListagemRequisicaoDTI (List<Requisicao> requisicoes) {
        List<ListagemRequisicaoDTO> requisicaoDTOs = new ArrayList<>();

        for (Requisicao requisicao : requisicoes) {
            requisicaoDTOs.add(new ListagemRequisicaoDTO(requisicao.requisicaoId, requisicao.nome, requisicao.usuario.getName(), requisicao.cliente, requisicao.observacao, requisicao.destino, requisicao.prioridade, requisicao.estagio));
        }

        return requisicaoDTOs;
    }
}