package org.example.mirinayapi.model.itemRequisicao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.mirinayapi.model.alertaItem.AlertaItem;
import org.example.mirinayapi.model.classificacaoFornecedor.ClassificacaoFornecedor;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.enums.itemRequisicao.DestinoItemEnum;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.itemRequisicao.DTO.ListagemItensRequisicaoConstrucaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.ListagemItensRequisicaoCotacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.aprovacao.DetalhesAprovacao;
import org.example.mirinayapi.model.itemRequisicao.DTO.aprovacao.ListagemItensRequisicaoAprovacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.ListagemItensRevisaoCotacaoDTO;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.model.similar.Similar;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "item_requisicao")
@Table(name = "item_requisicao")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ItemRequisicao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_requisicao_id")
    private Long itemRequisicaoId;

    private String referencia;

    private Integer quantidade;

    private String observacao;

    @JsonIgnore
    private Boolean status;

    private Boolean encontrado;

    @Enumerated(EnumType.STRING)
    private DestinoEnum destino;

    @Enumerated(EnumType.STRING)
    private EstadoItemEnum estadoItem;


    private String motivo;

    @ManyToOne
    @JoinColumn(name = "similar_id", referencedColumnName = "similar_id")
    @JsonIgnore
    private Similar similar;

    @ManyToOne
    @JoinColumn(name = "requisicao_id", referencedColumnName = "requisicao_id")
    @JsonIgnore
    private Requisicao requisicao;

    @OneToMany(mappedBy = "itemRequisicao", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<AlertaItem> alertaItens;

    @OneToMany(mappedBy = "itemRequisicao", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Cotacao> cotacoes;

    @ManyToOne
    @JoinColumn(name = "classificacao_fornecedor_id", referencedColumnName = "classificacao_fornecedor_id")
    private ClassificacaoFornecedor classificacaoFornecedor;



    // Métodos existentes
    public final List<ListagemItensRequisicaoConstrucaoDTO> itensRequisicoesTOitensRequisicaoConstrucaoDTOS(List<ItemRequisicao> itemRequisicoes) {
        List<ListagemItensRequisicaoConstrucaoDTO> itensRequisicoesDTOS = new ArrayList<>();

        for (ItemRequisicao itemRequisicao : itemRequisicoes) {
            if (itemRequisicao.status) {
                itensRequisicoesDTOS.add(new ListagemItensRequisicaoConstrucaoDTO(itemRequisicao.itemRequisicaoId, itemRequisicao.referencia, itemRequisicao.quantidade, itemRequisicao.observacao));
            }
        }

        return itensRequisicoesDTOS;
    }

    public final List<ListagemItensRequisicaoCotacaoDTO> itensRequisicoesTOitensRequisicaoCotacaoDTOS(List<ItemRequisicao> itemRequisicoes) {
        List<ListagemItensRequisicaoCotacaoDTO> itensRequisicoesDTOS = new ArrayList<>();

        for (ItemRequisicao itemRequisicao : itemRequisicoes) {
            if (itemRequisicao.status) {
                itensRequisicoesDTOS.add(new ListagemItensRequisicaoCotacaoDTO(itemRequisicao.itemRequisicaoId, itemRequisicao.referencia, itemRequisicao.quantidade, itemRequisicao.observacao, itemRequisicao.estadoItem));
            }
        }

        return itensRequisicoesDTOS;
    }

    @Override
    public String toString() {
        return "ItemRequisicao{" +
                "itemRequisicaoId=" + itemRequisicaoId +
                ", referencia='" + referencia + '\'' +
                ", quantidade=" + quantidade +
                ", observacao='" + observacao + '\'' +
                ", status=" + status +
                ", encontrado=" + encontrado +
                ", destino=" + destino +
                ", estadoItem=" + estadoItem +
                ", idSimilar=" + similar +
                ", requisicao=" + requisicao +
                ", alertaItens=" + alertaItens +
                ", cotacoes=" + cotacoes +
                '}';
    }

    public List<ListagemItensRequisicaoAprovacaoDTO> itensRequisicoesTOitensRequisicaoAprovacaoDTOS(List<ItemRequisicao> itemRequisicoes) {
        List<ListagemItensRequisicaoAprovacaoDTO> itensRequisicoesDTOS = new ArrayList<>();

        for (ItemRequisicao itemRequisicao : itemRequisicoes) {
            if (itemRequisicao.status) {
                itensRequisicoesDTOS.add(new ListagemItensRequisicaoAprovacaoDTO(
                        itemRequisicao.getItemRequisicaoId(),
                        itemRequisicao.getRequisicao().getNome(),
                        itemRequisicao.getEncontrado(),
                        itemRequisicao.getEstadoItem(),
                        new DetalhesAprovacao(
                                itemRequisicao.getSimilar().getMarca().getNome(),
                                itemRequisicao.getCotacoes().stream().map(Cotacao::getValorUnitario).findFirst().orElse(null),
                                itemRequisicao.getQuantidade(),
                                itemRequisicao.getCotacoes().stream().map(Cotacao::getTempoEntrega).findFirst().orElse(null)
                )));
            }
        }

        return itensRequisicoesDTOS;
    }
}
