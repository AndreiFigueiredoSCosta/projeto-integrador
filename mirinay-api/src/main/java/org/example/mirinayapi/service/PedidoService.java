package org.example.mirinayapi.service;

import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.enums.pedido.StatusPedidoEnum;
import org.example.mirinayapi.model.enums.pedido.TipoFrete;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.fornecedorCnpj.repositories.FornecedorCnpjRepository;
import org.example.mirinayapi.model.itemPedido.ItemPedido;
import org.example.mirinayapi.model.itemPedido.ItemPedidoId;
import org.example.mirinayapi.model.itemPedido.repositories.ItemPedidoRepository;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.itemRequisicao.repositories.ItemRequisicaoRepository;
import org.example.mirinayapi.model.pedidos.DTO.*;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.example.mirinayapi.model.pedidos.repositories.PedidoRepository;
import org.example.mirinayapi.model.transportadorCnpj.TransportadorCnpj;
import org.example.mirinayapi.model.transportadorCnpj.repositories.TransportadorFilialRepository;
import org.example.mirinayapi.model.unidade.Unidade;
import org.example.mirinayapi.model.unidade.repositories.UnidadeRepositories;
import org.example.mirinayapi.model.usuario.Usuario;
import org.example.mirinayapi.model.usuario.repositories.UserRepo;
import org.example.mirinayapi.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CotacaoRepository cotacaoRepository;

    @Autowired
    private FornecedorCnpjRepository fornecedorCnpjRepository;

    @Autowired
    private UnidadeRepositories unidadeRepository;

    @Autowired
    private UserRepo usuarioRepository;

    @Autowired
    private TransportadorFilialRepository transportadorCnpjRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private ItemRequisicaoRepository itemRequisicaoRepository;

    @Autowired
    private JwtService jwtService;

    public void criarPedido(String token, GerarDTO pedidoDTO) {

        // Validar o fornecedor
        FornecedorCnpj fornecedor = fornecedorCnpjRepository.findById(pedidoDTO.fornecedorId())
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));

        // Validar a unidade
        Unidade unidade = unidadeRepository.findById(pedidoDTO.unidadeId())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada"));

        String email = jwtService.extractUsername(token);
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        Usuario solicitante = usuario.orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Validar a transportadora
        TransportadorCnpj transportadora = transportadorCnpjRepository.findById(pedidoDTO.transportadorId())
                .orElseThrow(() -> new RuntimeException("Transportadora não encontrada"));

        List<Cotacao> cotacaos = pedidoDTO.cotacaoIds().stream()
                .map(id -> cotacaoRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Cotacao não encontrada")))
                .toList();

        // Criar o pedido
        Pedido pedido = Pedido.builder()
                .nome(fornecedor.getNome())
                .dataPrevisao(pedidoDTO.prevEntrega())
                .fornecedorCnpj(fornecedor)
                .unidadeDestino(unidade)
                .usuario(solicitante)
                .transportadorCnpj(transportadora)
                .status(StatusPedidoEnum.PENDENTE)
//                .valorFrete(BigDecimal.valueOf(pedidoDTO.freteId()))
//                .condicaoPagamento(null)
                .build();
        Pedido pedidoSave = pedidoRepository.save(pedido);

        for (Cotacao cotacao : cotacaos) {

            ItemPedidoId id = new ItemPedidoId();
            id.setPedidoId(pedidoSave.getPedidoID());
            id.setCotacaoId(cotacao.getCotacaoId());
            id.setSimilarId(cotacao.getItemRequisicao().getSimilar().getSimilarId());

            ItemPedido itemPedido = ItemPedido.builder()
                    .id(id)
                    .pedido(pedidoSave)
                    .cotacao(cotacao)
                    .similar(cotacao.getItemRequisicao().getSimilar())
                    .build();
            itemPedidoRepository.save(itemPedido);
        }
        ResponseEntity.ok().body("Pedido criado com sucesso");
    }
//    ListagemIndicesPedidosPendentesDTO

    public List<ListagemIndicesPedidosPendentesDTO> listarPedidosPendentes(Pageable pageable) {

        List<ListagemIndicesPedidosPendentesDTO> list = new ArrayList<>();
        EstadoItemEnum statusPedidoEnum = EstadoItemEnum.A_PEDIR;
        try {
            fornecedorCnpjRepository.findAllByFornecedorCnpjIdAndCotacao(pageable).forEach(fornecedorCnpj -> {
                    BigDecimal valorTotal = fornecedorCnpj.getCotacoes().stream()
                            .map(cotacao -> cotacao.getValorUnitario()
                                    .multiply(BigDecimal.valueOf(cotacao.getQuantidade())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                System.out.println("valorTotal = " + valorTotal);
                    String descricaoAlerta = fornecedorCnpj.getFornecedor().getAlertas().isEmpty()
                            ? "Sem alertas"
                            : fornecedorCnpj.getFornecedor().getAlertas().get(0).getDescricao();

                    // Adicionar o DTO à lista de resultados
                    list.add(new ListagemIndicesPedidosPendentesDTO(
                            fornecedorCnpj.getFornecedorCnpjId(),
                            fornecedorCnpj.getNome(),
                            valorTotal,
                            fornecedorCnpj.getPedidoMinimo(),
                            descricaoAlerta
                    ));
                });
        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    public List<ListagemIndicesPedidosPendentesDTO> buscarPedidosPendentes(String label, Pageable pageable) {
        EstadoItemEnum statusPedidoEnum = EstadoItemEnum.A_PEDIR;

        return cotacaoRepository.findAllByCotacaoEstadoCotacaoAndLikeName(pageable, statusPedidoEnum, label).stream().map(pedido -> {

            BigDecimal valorTotal = pedido.getValorUnitario()
                    .multiply(BigDecimal.valueOf(pedido.getQuantidade()));


            String descricaoAlerta = pedido.getFornecedorCnpj().getFornecedor().getAlertas().isEmpty()
                    ? "Sem alertas"
                    : pedido.getFornecedorCnpj().getFornecedor().getAlertas().get(0).getDescricao();

            // Construir o DTO
            return new ListagemIndicesPedidosPendentesDTO(
                    pedido.getFornecedorCnpj().getFornecedorCnpjId(),
                    pedido.getFornecedorCnpj().getNome(),
                    valorTotal,
                    pedido.getFornecedorCnpj().getPedidoMinimo(),
                    descricaoAlerta
            );
        }).collect(Collectors.toList());
    }
    public List<ListagemItensPedidosPendentesDTO> buscarPedidoPendentePorId(Long id) {

//        List<ListagemItensPedidosPendentesDTO> itens = cotacaoRepository.findAllByFornecedorCnpj_FornecedorCnpjIdAndEstadoCotacao(id, EstadoItemEnum.A_PEDIR).stream()
        List<ListagemItensPedidosPendentesDTO> itens = cotacaoRepository.findAllByFornecedorCnpj_FornecedorCnpjId(id).stream()
                .map(pedido -> new ListagemItensPedidosPendentesDTO(
                        pedido.getItemRequisicao().getItemRequisicaoId(),
                        pedido.getFornecedorCnpj().getFornecedorCnpjId(),
                        pedido.getItemRequisicao().getReferencia(),
                        pedido.getItemRequisicao().getSimilar().getProduto().getNome(),
                        pedido.getItemRequisicao().getRequisicao().getRequisicaoId(),
                        pedido.getItemRequisicao().getSimilar().getProduto().getUnidade().getNome(),
                        pedido.getItemRequisicao().getDestino(),
                        pedido.getValorUnitario(),
                        pedido.getItemRequisicao().getQuantidade(),
                        pedido.getItemRequisicao().getSimilar().getProduto().getSubgrupo().getGrupo().getNome(),
                        pedido.getItemRequisicao().getSimilar().getProduto().getSubgrupo().getNome()
                ))
                .toList();

        Set<String> refs = new HashSet<>();
        return itens.stream()
                .filter(item -> refs.add(item.referencia()))
                .collect(Collectors.toList());
    }

    public List<ListagemPedidosConcluidosDTO> listarPedidosConcluidos(Pageable pageable) {

        List<StatusPedidoEnum> statusPedidoEnum = List.of(StatusPedidoEnum.CONCLUIDO, StatusPedidoEnum.PENDENTE);
        List <ListagemPedidosConcluidosDTO> list = new ArrayList<>();
        pedidoRepository.findByStatusIn(statusPedidoEnum, pageable).forEach(
                pedido -> {
                    BigDecimal valorTotal = itemPedidoRepository.findAllByPedidoPedidoID(pedido.getPedidoID()).stream()
                            .map(itemPedido -> itemPedido.getCotacao().getValorUnitario()
                                    .multiply(BigDecimal.valueOf(itemPedido.getCotacao().getQuantidade())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);



                    list.add(new ListagemPedidosConcluidosDTO(
                        pedido.getPedidoID(),
                        pedido.getFornecedorCnpj().getNome(),
                        valorTotal,
                        pedido.getNfe() != null && pedido.getNfe().getEncontrado(), //nfe enum
                        pedido.getDataPedido(),
                        pedido.getDataPrevisao(),
                        pedido.getUnidadeDestino().getNome(),
                        pedido.getUsuario().getName()
                    ));
                });
         return list;
    }
    public List<ListagemPedidosConcluidosDTO> buscarPedidosConcluidos(String label, Pageable pageable) {

        StatusPedidoEnum statusPedidoEnum = StatusPedidoEnum.CONCLUIDO;

        return pedidoRepository.findAllByFornecedorCnpj_NomeLikeAndStatus(pageable, label, statusPedidoEnum).stream().map(


                pedido -> new ListagemPedidosConcluidosDTO(
                        pedido.getPedidoID(),
                        pedido.getFornecedorCnpj().getNome(),
                        pedido.getCotacao().getValorUnitario(),
                        pedido.getNfe().getEncontrado(), //nfe enum
                        pedido.getDataPedido(),
                        pedido.getDataPrevisao(),
                        pedido.getUnidadeDestino().getNome(),
                        pedido.getUsuario().getName()
                )
        ).collect(Collectors.toList());
    }
    public void marcarPedidoRecebido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setRecebido(true);
        pedido.setStatus(StatusPedidoEnum.CONCLUIDO);
        pedidoRepository.save(pedido);

        itemPedidoRepository.findAllByPedidoPedidoID(id).forEach(itemPedido -> {
            ItemRequisicao itemRequisicao = itemPedido.getCotacao().getItemRequisicao();
            itemRequisicao.setEstadoItem(EstadoItemEnum.ENTREGUE);
            itemRequisicaoRepository.save(itemRequisicao);
        });
    }

    public ListagemRequisicaoPedidoDTO buscarPedidoDetalhePorId(Long id) {
        try {
            List<ItemPedido> ip = itemPedidoRepository.findAllByPedidoPedidoID(id);

            Set<Long> refs = new HashSet<>();

            BigDecimal valorTotal = ip.stream()
                    .filter(itemPedido -> refs.add(itemPedido.getCotacao().getItemRequisicao().getItemRequisicaoId()))
                    .map(itemPedido -> itemPedido.getCotacao().getValorUnitario()
                            .multiply(BigDecimal.valueOf(itemPedido.getCotacao().getQuantidade())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String condicaoPagamento = ip.get(0).getPedido().getCondicaoPagamento() == null
                    ? "Sem condição de pagamento"
                    : ip.get(0).getPedido().getCondicaoPagamento().getNome();


            return pedidoRepository.findById(id).map(pedido -> new ListagemRequisicaoPedidoDTO(
                    pedido.getPedidoID(),
                    pedido.getDataPedido(),
                    pedido.getUnidadeDestino().getNome(),
                    valorTotal,
                    pedido.getDataPrevisao(),
                    pedido.getCondicaoPagamento() == null
                            ? "Sem condição de pagamento"
                            : pedido.getCondicaoPagamento().getNome(),
                    pedido.getFornecedorCnpj().getFornecedor().getNome(),
                    pedido.getTransportadorCnpj().getNome(),
                    pedido.getUsuario().getName(),
                    pedido.getFrete(),
                    pedido.getNfe() != null && pedido.getNfe().getEncontrado()
            )).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    public List<ListagemItensPedidosPendentesDTO> buscarItensPedidoPorId(Long id) {

        List<ItemPedido> itens = itemPedidoRepository.findAllByPedidoPedidoID(id);

        return itens.stream().map(item -> new ListagemItensPedidosPendentesDTO(
                item.getCotacao().getItemRequisicao().getItemRequisicaoId(),
                item.getCotacao().getFornecedorCnpj().getFornecedorCnpjId(),
                item.getCotacao().getItemRequisicao().getReferencia(),
                item.getCotacao().getItemRequisicao().getSimilar().getProduto().getNome(),
                item.getCotacao().getItemRequisicao().getRequisicao().getRequisicaoId(),
                item.getCotacao().getItemRequisicao().getSimilar().getProduto().getUnidade().getNome(),
                item.getCotacao().getItemRequisicao().getDestino(),
                item.getCotacao().getValorUnitario(),
                item.getCotacao().getQuantidade(),
                item.getCotacao().getItemRequisicao().getSimilar().getProduto().getSubgrupo().getGrupo().getNome(),
                item.getCotacao().getItemRequisicao().getSimilar().getProduto().getSubgrupo().getNome()
        )).collect(Collectors.toList());
    }


}
