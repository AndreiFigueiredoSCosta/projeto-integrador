package org.example.mirinayapi.service;

import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.cotacao.DTO.ListagemCotacaoConcluidas;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.enums.requisicao.PrioridadeEnum;
import org.example.mirinayapi.model.fornecedor.repositories.FornecedorRepository;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.itemPedido.repositories.ItemPedidoRepository;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.itemRequisicao.repositories.ItemRequisicaoRepository;
import org.example.mirinayapi.model.requisicao.DTO.CadastrarRequisicaoDTO;
import org.example.mirinayapi.model.requisicao.DTO.EditarRequisicaoDTO;
import org.example.mirinayapi.model.requisicao.DTO.ListagemRequisicaoDTO;
import org.example.mirinayapi.model.requisicao.DTO.RequisicaoUnificacaoDTO;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.model.requisicao.repositories.RequisicaoRepository;
import org.example.mirinayapi.model.unidade.Unidade;
import org.example.mirinayapi.model.unidade.repositories.UnidadeRepositories;
import org.example.mirinayapi.model.unidadePossui.repositories.UnidadePossuiRepository;
import org.example.mirinayapi.model.usuario.Usuario;
import org.example.mirinayapi.model.usuario.repositories.UserRepo;
import org.example.mirinayapi.security.JwtService;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RequisicaoService {

    private final RequisicaoRepository repository;
    private final ItemRequisicaoRepository itemRequisicaoRepository;
    private final UnidadePossuiRepository unidadePossuiRepository;
    private final CotacaoRepository cotacaoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final UnidadeRepositories unidadeRepositories;
    private final JwtService jwtService;
    private final UserRepo userRepo;

    private final FornecedorRepository fornecedorRepository;

    private final ItemRequisicaoService itemRequisicaoService;

    public RequisicaoService(
            RequisicaoRepository repository,
            ItemRequisicaoRepository itemRequisicaoRepository,
            UnidadeRepositories unidadeRepositories,
            UnidadePossuiRepository unidadePossuiRepository,
            CotacaoRepository cotacaoRepository,
            ItemPedidoRepository itemPedidoRepository,
            JwtService jwtService,
            UserRepo userRepo,
            FornecedorRepository fornecedorRepository,
            @Lazy ItemRequisicaoService itemRequisicaoService
    ) {
        this.repository = repository;
        this.itemRequisicaoRepository = itemRequisicaoRepository;
        this.unidadeRepositories = unidadeRepositories;
        this.unidadePossuiRepository = unidadePossuiRepository;
        this.cotacaoRepository = cotacaoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.fornecedorRepository = fornecedorRepository;
        this.itemRequisicaoService = itemRequisicaoService;
    }

    public void cadastrarRequisicao(String token, CadastrarRequisicaoDTO requisicaoDTO) {
        String email = jwtService.extractUsername(token);
        Optional<Usuario> usuario = userRepo.findByEmail(email);
        Optional<Unidade> unidade = unidadeRepositories.findById(requisicaoDTO.unidadeId());

        System.out.println(requisicaoDTO);
        Requisicao requisicao = Requisicao.builder()
                .nome(requisicaoDTO.nome())
                .cliente(requisicaoDTO.cliente())
                .observacao(requisicaoDTO.observacao())
                .destino(DestinoEnum.valueOf(requisicaoDTO.destino()))
                .prioridade(PrioridadeEnum.valueOf(requisicaoDTO.prioridade()))
                .estagio(EstagioEnum.CONSTRUCAO)
                .usuario(usuario.orElse(null))
                .unidade(unidade.orElse(null))
                .status(true)
                .build();

        System.out.println(requisicao.toString());
        this.repository.save(requisicao);
    }

    public void editarRequisicao(String token, Long id, EditarRequisicaoDTO requisicaoDTO) {
        String email = jwtService.extractUsername(token);
        Optional<Usuario> usuario = userRepo.findByEmail(email);

        Requisicao requisicao = repository.getReferenceById(id);

        requisicao.setNome(requisicaoDTO.nome());
        requisicao.setCliente(requisicaoDTO.cliente());
        requisicao.setObservacao(requisicaoDTO.observacao());
        requisicao.setDestino(requisicaoDTO.destino());
        requisicao.setPrioridade(requisicaoDTO.prioridade());
        requisicao.setEstagio(requisicaoDTO.estagio());
        requisicao.setUsuario(usuario.orElse(null));

        this.repository.save(requisicao);
    }

    public void deletarRequisicao(Long id) {
        Requisicao requisicao = this.repository.getReferenceById(id);

        requisicao.setStatus(false);

        this.repository.save(requisicao);
    }

    public void avancarEstagio(Long id, EstagioEnum estagio) {
        Requisicao requisicao = this.repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Requisição não encontrada"));

        // Estágio atual
        EstagioEnum estagioAtual = requisicao.getEstagio();

        // Obtém o próximo estágio válido
        EstagioEnum proximoEstagio = estagioAtual.getProximo();

        // Validação: o novo estágio deve ser igual ao próximo
        if (proximoEstagio == null || !proximoEstagio.equals(estagio)) {
            throw new IllegalArgumentException(
                    "Transição de estágio inválida. Próximo estágio esperado: " +
                            (proximoEstagio != null ? proximoEstagio.name() : "Nenhum (Concluído)")
            );
        }

        // Atualiza o estágio e salva
        requisicao.setEstagio(estagio);
        this.repository.save(requisicao);

    }

    // Função para buscar todas as requisições não concluídas com destino a VENDA
    public List<ListagemRequisicaoDTO> buscarRequisicoesNaoConcluidasDestinoVenda() {
        return new Requisicao().requisicaoParaListagemRequisicaoDTI(this.repository.findAllNonConcludedWithDestinoVenda());
    }

    // Função para buscar todas as requisições não concluídas com destino a ESTOQUE
    public List<ListagemRequisicaoDTO> buscarRequisicoesNaoConcluidasDestinoEstoque() {
        return new Requisicao().requisicaoParaListagemRequisicaoDTI(repository.findAllNonConcludedWithDestinoEstoque());
    }

    // Função para buscar todas as requisições não concluídas com destino a VENDA/ESTOQUE
    public List<ListagemRequisicaoDTO> buscarRequisicoesNaoConcluidasDestinoVendaEstoque() {
        return new Requisicao().requisicaoParaListagemRequisicaoDTI(repository.findAllNonConcludedWithDestinoVendaEstoque());
    }

    public List<ListagemRequisicaoDTO> pesquisarRequisicoesNaoConcluidasDestinoVenda(String label) {
        return new Requisicao().requisicaoParaListagemRequisicaoDTI(this.repository.findAllNonConcludedWithDestinoVendaAndNome(label));
    }

    // Função para buscar todas as requisições não concluídas com destino a ESTOQUE
    public List<ListagemRequisicaoDTO> pesquisarRequisicoesNaoConcluidasDestinoEstoque(String label) {
        return new Requisicao().requisicaoParaListagemRequisicaoDTI(repository.findAllNonConcludedWithDestinoEstoqueAndNome(label));
    }

    // Função para buscar todas as requisições não concluídas com destino a VENDA/ESTOQUE
    public List<ListagemRequisicaoDTO> pesquisarRequisicoesNaoConcluidasDestinoVendaEstoque(String label) {
        return new Requisicao().requisicaoParaListagemRequisicaoDTI(repository.findAllNonConcludedWithDestinoVendaEstoqueAndNome(label));
    }




    // Função para buscar requisições concluídas com paginação (até 10 itens por página)
    public Page<Requisicao> buscarRequisicoesConcluidasPaginadas(int pagina, int tamanho) {
        Pageable pageable = PageRequest.of(pagina, tamanho);
        return repository.findAllConcluded(pageable);
    }
        public List<ListagemCotacaoConcluidas> buscarRequisicoesConcluidas(String label, Pageable pageable) {

        return repository.findAllConcludedLikeLabel(label, pageable).stream().map(
                requisicao -> new ListagemCotacaoConcluidas(
                        requisicao.getRequisicaoId(),
                        requisicao.getNome(),
                        Math.toIntExact(requisicao.getUsuario().getId()),
                        requisicao.getEstagio().compareTo(EstagioEnum.APROVACAO) == 0,
                        requisicao.getDestino()
                )
        ).collect(Collectors.toList());
    }
    // Função para buscar requisição por id
    public ListagemRequisicaoDTO buscarRequisicaoPorId(Long id) {
        Requisicao requisicao = this.repository.getReferenceById(id);

        return new ListagemRequisicaoDTO(
                requisicao.getRequisicaoId(),
                requisicao.getNome(),
                requisicao.getUsuario().getName(),
                requisicao.getCliente(),
                requisicao.getObservacao(),
                requisicao.getDestino(),
                requisicao.getPrioridade(),
                requisicao.getEstagio());
    }

    public Map<String, Object> consultarEstoqueERequisicoesPorProduto(Long produtoId) {
        Map<String, Object> resultado = new HashMap<>();

        // ---------------- ESTOQUE ---------------- //
        Map<String, Integer> estoquePorUnidade = new HashMap<>();

        for (Unidade unidade : unidadeRepositories.findAll()) {
            // Busca o estoque da unidade
            Integer quantidadeUn = unidadePossuiRepository.findQuantidadeByProduto_ProdutoIdAndUnidade_UnidadeId(produtoId, unidade.getUnidadeId());
            // Se a quantidade for null, considera como 0
            quantidadeUn = quantidadeUn != null ? quantidadeUn : 0;

            System.out.println("Unidade: " + unidade.getNome() + " | Quantidade: " + quantidadeUn);

            // Adiciona a unidade no mapa com o estoque
            estoquePorUnidade.put(unidade.getNome(), quantidadeUn);
        }

        // ---------------- REQUISIÇÕES ---------------- //
        Map<String, Integer> requisicoesPorEstado = new HashMap<>();
        List<Requisicao> requisicoes = repository.findRequisicoesByProdutoId(produtoId);

        // Inicializa o mapa de contagem de requisições por estado
        for (EstagioEnum estagio : EstagioEnum.values()) {
            requisicoesPorEstado.put(estagio.name(), 0);
        }

        for (Requisicao requisicao : requisicoes) {
            // Para cada requisição, conta as quantidades por estágio
            for (ItemRequisicao item : requisicao.getItensRequisicao()) {
                // Verifica se o item tem um produto idSimilar e se o produto é o que estamos buscando
                if (item.getSimilar() != null && item.getSimilar().getProduto().getProdutoId().equals(produtoId)) {
                    // Obtém o estágio da requisição
                    EstagioEnum estagio = requisicao.getEstagio();

                    // Verifica se o estágio já existe no mapa, se não, inicializa com 0
                    requisicoesPorEstado.putIfAbsent(estagio.name(), 0);

                    // Agora, somamos a quantidade ao valor existente
                    int quantidadeAtual = requisicoesPorEstado.get(estagio.name());
                    requisicoesPorEstado.put(estagio.name(), quantidadeAtual + item.getQuantidade());
                }
            }
        }
        // ---------------- RESULTADO FINAL ---------------- //
        resultado.put("estoque", estoquePorUnidade);
        resultado.put("requisicoes", requisicoesPorEstado);

        return resultado;
    }

    public Requisicao assertRequisicao(Long requisicaoId) throws BadRequestException {
        return repository.findByRequisicaoIdAndStatusIsTrue(requisicaoId)
                .orElseThrow(() -> new BadRequestException("Requisição não encontrada"));
    }
    public Map<String, Object> consultarDadosGraficos(Long produtoId) {
        Map<String, Object> resultado = new HashMap<>();

        // ---------------- PREÇOS NOS ÚLTIMOS 6 MESES ---------------- //
        List<Map<String, Object>> precoUltimosMeses = new ArrayList<>();
        LocalDate dataLimite = LocalDate.now().minusMonths(6);

        // Buscar preços dos fornecedores nos últimos 6 meses
        List<Object[]> precos = fornecedorRepository.findPrecosUltimos6Meses(produtoId, dataLimite);



        for (Object[] preco : precos) {
            LocalDate mesFormatado = ((java.sql.Date) preco[0]).toLocalDate();

            // Formata o LocalDate no padrão desejado (por exemplo, "yyyy-MM")
            String mesFormatadoString = mesFormatado.format(DateTimeFormatter.ofPattern("MM"));
            Map<String, Object> precoInfo = new HashMap<>();
            precoInfo.put("mes", mesFormatadoString); // Mês ou período
            precoInfo.put("preco", preco[1]); // Preço
            precoInfo.put("fornecedor", preco[2]); // Nome do fornecedor
            precoUltimosMeses.add(precoInfo);
        }
        resultado.put("precoUltimos6Meses", precoUltimosMeses);

        // ---------------- FORNECEDORES MAIS COTADOS ---------------- //
        List<Map<String, Object>> fornecedoresMaisCotados = new ArrayList<>();

        // Buscar quantidade de cotações por fornecedor
        List<Object[]> fornecedores = fornecedorRepository.findFornecedoresMaisCotados(produtoId);


        for (Object[] fornecedor : fornecedores) {
            Map<String, Object> fornecedorInfo = new HashMap<>();
            fornecedorInfo.put("fornecedorId", fornecedor[0]); // Nome do fornecedor
            fornecedorInfo.put("fornecedor", fornecedor[1]); // Nome do fornecedor
            fornecedorInfo.put("quantidade", fornecedor[2]); // Quantidade de cotações
            fornecedoresMaisCotados.add(fornecedorInfo);
        }
        resultado.put("fornecedoresMaisCotados", fornecedoresMaisCotados);

        return resultado;
    }

    public void ultimaCotacoesDoProduto(Long produto){

    }

    //Unificar requisições
    public void unificarRequisicoes(RequisicaoUnificacaoDTO requisicaoDTO) {
        // Validar solicitante
        Usuario solicitante = userRepo.findById(requisicaoDTO.solicitanteId())
                .orElseThrow(() -> new RuntimeException("Solicitante não encontrado"));

        Unidade unidade = unidadeRepositories.findById(requisicaoDTO.unidadeId())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada"));

        // Alterar o estado dos itens para "REMOVIDO"
        List<ItemRequisicao> itens = requisicaoDTO.itens().stream()
                .map(id -> itemRequisicaoRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Item de requisição não encontrado com ID: " + id)))
                .toList();

        itens.forEach(item -> item.setEstadoItem(EstadoItemEnum.REMOVIDO));
        itemRequisicaoRepository.saveAll(itens);

        // Criar nova requisição
        Requisicao novaRequisicao = Requisicao.builder()
                .nome(requisicaoDTO.nome())
                .usuario(solicitante)
                .prioridade(requisicaoDTO.prioridade())
                .destino(DestinoEnum.ESTOQUE)
                .observacao(requisicaoDTO.observacao())
                .estagio(EstagioEnum.COTACAO)
                .unidade(unidade)
                .status(true)
                .build();
        repository.save(novaRequisicao);


        List<ItemRequisicao> itensUnificados = itens.stream()
                .map(item -> ItemRequisicao.builder()
                        .referencia(item.getReferencia())
                        .quantidade(item.getQuantidade())
                        .observacao(item.getObservacao())
                        .status(true)
                        .encontrado(true)
                        .destino(item.getDestino())
                        .estadoItem(EstadoItemEnum.COTANDO)
                        .similar(item.getSimilar())
                        .requisicao(novaRequisicao)
                        .status(true)
                        .build())
                .toList();

        itemRequisicaoRepository.saveAll(itensUnificados);
        itensUnificados.forEach(itemRequisicaoService::createInitialCotacao);

//        associarCotacoesEPedidos(itens, itensUnificados);
    }

    public List<FornecedorCnpj> getFornecedoresCnpjs (Long requisicaoId) throws BadRequestException {
        Requisicao requisicao = assertRequisicao(requisicaoId);

        List<FornecedorCnpj> fornecedorCnpjs = new ArrayList<>();

        requisicao.getCotacoes().forEach(
                cotacao -> {
                    if (fornecedorCnpjs
                            .stream()
                            .noneMatch(
                                    fornecedorCnpj ->
                                            cotacao
                                                    .getFornecedorCnpj()
                                                    .getFornecedorCnpjId()
                                                    .equals(fornecedorCnpj.getFornecedorCnpjId())))
                    {
                        fornecedorCnpjs.add(cotacao.getFornecedorCnpj());
                    }
                }
        );

        return fornecedorCnpjs;
    }


//    private void associarCotacoesEPedidos(List<ItemRequisicao> itensOriginais, List<ItemRequisicao> itensUnificados) {
//        for (int i = 0; i < itensOriginais.size(); i++) {
//            ItemRequisicao itemOriginal = itensOriginais.get(i);
//            ItemRequisicao itemUnificado = itensUnificados.get(i);
//
//            // Associar cotações
//            List<Cotacao> cotacoes = cotacaoRepository.findAllByItemRequisicao_ItemRequisicaoId(itemOriginal.getItemRequisicaoId());
//            if (cotacoes != null && !cotacoes.isEmpty()) {
//                cotacoes.forEach(cotacao -> cotacao.setItemRequisicao(itemUnificado));
//                cotacaoRepository.saveAll(cotacoes);
//            }
//
//            // Associar pedidos
//            List<ItemPedido> pedidos = itemPedidoRepository.findAllByItemRequisicao_ItemRequisicaoId(itemOriginal.getItemRequisicaoId());
//            if (pedidos != null && !pedidos.isEmpty()) {
//                // Excluir os registros antigos
//                itemPedidoRepository.deleteAll(pedidos);
//
//                // Criar novos registros com os identificadores atualizados
//                List<ItemPedido> novosPedidos = pedidos.stream().map(pedido -> {
//                    ItemPedido novoPedido = new ItemPedido();
//
//                    // Criar novo ID composto
//                    ItemPedidoId novoId = new ItemPedidoId(pedido.getPedido().getPedidoID(), itemUnificado.getItemRequisicaoId());
//
//                    // Atualizar o novo pedido
//                    novoPedido.setId(novoId);
//                    novoPedido.setPedido(pedido.getPedido());
//                    novoPedido.setItemRequisicao(itemUnificado);
//
//                    return novoPedido;
//                }).toList();
//
//                // Salvar os novos registros
//                itemPedidoRepository.saveAll(novosPedidos);
//            }
//        }
//    }
}
