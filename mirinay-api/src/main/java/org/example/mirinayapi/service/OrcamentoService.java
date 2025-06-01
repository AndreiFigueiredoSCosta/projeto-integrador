package org.example.mirinayapi.service;


import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.mirinayapi.model.cliente.Cliente;
import org.example.mirinayapi.model.cliente.repositories.ClienteRepository;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.itemRequisicao.repositories.ItemRequisicaoRepository;
import org.example.mirinayapi.model.orcamento.DTO.CadastroOrcamentoDTO;
import org.example.mirinayapi.model.orcamento.DTO.ExibirOrcamentoDTO;
import org.example.mirinayapi.model.orcamento.DTO.ListagemOrcamentoDTO;
import org.example.mirinayapi.model.orcamento.Orcamento;
import org.example.mirinayapi.model.orcamento.repositories.OrcamentoRepository;
import org.example.mirinayapi.model.orcamentoSimilar.DTO.AlterarOrcamentoSimilarDTO;
import org.example.mirinayapi.model.orcamentoSimilar.DTO.ListagemOrcamentoSimilarDTO;
import org.example.mirinayapi.model.orcamentoSimilar.DTO.OrcamentoSimilarDTO;
import org.example.mirinayapi.model.orcamentoSimilar.OrcamentoSimilar;
import org.example.mirinayapi.model.orcamentoSimilar.repositories.OrcamentoSimilarRepository;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.model.similar.repositories.ProdutoSimilarRepository;
import org.example.mirinayapi.model.usuario.Usuario;
import org.example.mirinayapi.model.usuario.repositories.UserRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Transactional
@Service
public class OrcamentoService {
    private final OrcamentoRepository orcamentoRepository;
    private final ClienteRepository clienteRepository;
    private final UserRepo userRepository;
    private final OrcamentoSimilarRepository orcamentoSimilarRepository;
    private final ProdutoSimilarRepository produtoSimilarRepository;
    private final CotacaoRepository cotacaoRepository;
    private final ItemRequisicaoRepository itemRequisicaoRepository;

    public OrcamentoService(
            OrcamentoRepository or,
            ClienteRepository cr,
            UserRepo ur,
            OrcamentoSimilarRepository osr,
            ProdutoSimilarRepository prs,
            CotacaoRepository ctr,
            ItemRequisicaoRepository irr
    ) {
        orcamentoRepository = or;
        clienteRepository = cr;
        userRepository = ur;
        orcamentoSimilarRepository = osr;
        produtoSimilarRepository = prs;
        cotacaoRepository = ctr;
        itemRequisicaoRepository = irr;
    }

    public List<ListagemOrcamentoDTO> findAll(Pageable pageable){
        Page<Orcamento> orcamentos = this.orcamentoRepository.findAll(pageable);
        if (orcamentos.isEmpty()){
            return List.of();
        }

        return orcamentos.stream().map(
                orc -> {
                    return ListagemOrcamentoDTO.builder()
                            .cliente(orc.getCliente().getNomeCompleto())
                            .vendedor(orc.getVendedor().getName())
                            .orcamentoId(orc.getOrcamentoId())
                            .build();
                }
        ).toList();
    }

    //esse aqui é pra puxar o orçamento específico com os detalhes
    public ExibirOrcamentoDTO exibirOrcamentoCompleto(Long id) {
        Orcamento orcamento = this.orcamentoRepository.findOrcamentoByOrcamentoId(id)
                .orElseThrow(() -> new EntityNotFoundException("Orçamento não encontrado!"));

        return ExibirOrcamentoDTO.builder()
                .orcamentoId(id)
                .cliente(orcamento.getCliente().getNomeCompleto())
                .vendedor(orcamento.getVendedor().getName())
                .data(orcamento.getDataOrcamento())
                .valorTotal(orcamento.getValorTotal())
                .produtos(orcamento.getOrcamentoSimilar()
                        .stream()
                        .map(orcamentoSimilar ->
                                ListagemOrcamentoSimilarDTO.builder()
                                        .nomeSimilar(orcamentoSimilar.getSimilar().getReferencia())
                                        .quantidade(orcamentoSimilar.getQuantidade())
                                        .valorVarejo(orcamentoSimilar.getValorVarejo())
                                        .valorAtacado(orcamentoSimilar.getValorAtacado())
                                        .tipoDeMaquina(orcamentoSimilar.getTipoDeMaquina())
                                        .marcaSimilar(orcamentoSimilar.getMarcaDaMaquina())
                                        .build()
                        )
                        .toList()
                )
                .build();
    }

    /*Esse é pra pesquisar pelo numero
    Realmente não faz muito sentido retornar uma lista e paginada pra um unico objeto,
    porém com o front já tá configurado certinho e não entendi totalmente vou deixar assim pra
    não ter perigo de fazer cagada*/
    public List<ListagemOrcamentoDTO> findById(Long id, Pageable pageable) {
        Page<Orcamento> orcamentos = this.orcamentoRepository.findByOrcamentoId(id, pageable);
        if (orcamentos.isEmpty()){
            return List.of();
        }

        return orcamentos.stream().map(
                orc -> {
                    return ListagemOrcamentoDTO.builder()
                            .cliente(orc.getCliente().getNomeCompleto())
                            .vendedor(orc.getVendedor().getName())
                            .orcamentoId(orc.getOrcamentoId())
                            .build();
                }
        ).toList();
    }

    public List<ListagemOrcamentoDTO> findByVendedor(String nomeDoVendedor, Pageable pageable) {
        Page<Orcamento> orcamentos = this.orcamentoRepository.findByVendedor_NameContainingIgnoreCase(nomeDoVendedor ,pageable);
        if (orcamentos.isEmpty()){
            return List.of();
        }

        return orcamentos.stream().map(
                orc -> {
                    return ListagemOrcamentoDTO.builder()
                            .cliente(orc.getCliente().getNomeCompleto())
                            .vendedor(orc.getVendedor().getName())
                            .orcamentoId(orc.getOrcamentoId())
                            .build();
                }
        ).toList();
    }

    public List<ListagemOrcamentoDTO> findByCliente(String nomeDoVendedor, Pageable pageable) {
        Page<Orcamento> orcamentos = this.orcamentoRepository.findByCliente_NomeCompletoContainingIgnoreCase(nomeDoVendedor ,pageable);
        if (orcamentos.isEmpty()){
            return List.of();
        }

        return orcamentos.stream().map(
                orc -> {
                    return ListagemOrcamentoDTO.builder()
                            .cliente(orc.getCliente().getNomeCompleto())
                            .vendedor(orc.getVendedor().getName())
                            .orcamentoId(orc.getOrcamentoId())
                            .build();
                }
        ).toList();
    }

    public ExibirOrcamentoDTO cadastrarOrcamento(CadastroOrcamentoDTO dadosOrcamento) {
        Usuario vendedor = userRepository.findById(dadosOrcamento.vendedorId())
                .orElseThrow(() -> new EntityNotFoundException("Vendedor não encontrado"));

        Cliente cliente = clienteRepository.findById(dadosOrcamento.clienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        Orcamento orcamento = Orcamento.builder()
                .vendedor(vendedor)
                .cliente(cliente)
                .dataOrcamento(dadosOrcamento.dataOrcamento())
                .valorTotal(BigDecimal.ZERO)
                .build();

        orcamentoRepository.save(orcamento);

        List<OrcamentoSimilar> itens = new ArrayList<>();

        if (dadosOrcamento.produtos() != null) {
            for (OrcamentoSimilarDTO produto : dadosOrcamento.produtos()){
                OrcamentoSimilar item = criarOrcamentoSimilarModel(produto, orcamento);
                orcamentoSimilarRepository.save(item);
                itens.add(item);
            }
            orcamento.setOrcamentoSimilar(itens);

            BigDecimal total = itens.stream()
                    .map(OrcamentoSimilar::getValorVarejo)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            orcamento.setValorTotal(total);
        }

        List<ListagemOrcamentoSimilarDTO> produtosDTO = criarListagemOrcamentoSimilarDTO(itens);

        return ExibirOrcamentoDTO.builder()
                .orcamentoId(orcamento.getOrcamentoId())
                .cliente(cliente.getNomeCompleto())
                .vendedor(vendedor.getName())
                .data(orcamento.getDataOrcamento())
                .valorTotal(orcamento.getValorTotal())
                .produtos(produtosDTO)
                .build();
    }

    //Pra adicionar um novo similar no orcamento
    public Orcamento adicionarSimilarNoOrcamento(Long idOrcamento, OrcamentoSimilarDTO dados){
        Orcamento orcamento = this.orcamentoRepository.findOrcamentoByOrcamentoId(idOrcamento)
                .orElseThrow(() -> new EntityNotFoundException("Orcamento não encontrado!"));

        Similar similar = this.produtoSimilarRepository.findById(dados.idSimilar())
                .orElseThrow(() -> new EntityNotFoundException("Similar não encontrado!"));

        if (this.orcamentoSimilarRepository
                .findOrcamentoSimilarByOrcamento_OrcamentoIdAndSimilar_SimilarId(idOrcamento, dados.idSimilar())
                .isPresent()) {
            throw new IllegalArgumentException("Produto igual na lista");
        }

        OrcamentoSimilar orcamentoSimilar = OrcamentoSimilar
                .builder()
                .orcamento(orcamento)
                .similar(similar)
                .quantidade(dados.quantidade())
                .tipoDeMaquina(dados.tipoDeMaquina())
                .marcaDaMaquina(dados.marcaMaquina())
                .build();

        this.orcamentoSimilarRepository.save(orcamentoSimilar);
        orcamento.getOrcamentoSimilar().add(orcamentoSimilar);

        return orcamento;
    }

    //Para editar um similar já adicionado no orcamento
    public Orcamento editarSimilarNoOrcamento(Long idOrcamento,
                                              Long idSimilar,
                                              AlterarOrcamentoSimilarDTO dados){

        Orcamento orcamento = this.orcamentoRepository.findOrcamentoByOrcamentoId(idOrcamento)
                .orElseThrow(() -> new EntityNotFoundException("Orcamento não encontrado"));

        OrcamentoSimilar orcamentoSimilar = this
                .orcamentoSimilarRepository
                .findOrcamentoSimilarByOrcamento_OrcamentoIdAndSimilar_SimilarId(
                        idOrcamento,
                        idSimilar
                )
                .orElseThrow(() -> new EntityNotFoundException("Relação OrcamentoSimilar não encontrada!"));

        if(dados.marcaDaMaquina() != null) {
            orcamentoSimilar.setMarcaDaMaquina(dados.marcaDaMaquina());
        }

        if(dados.tipoDeMaquina() != null) {
            orcamentoSimilar.setTipoDeMaquina(dados.tipoDeMaquina());
        }

        if(dados.quantidade() != null){
            orcamentoSimilar.setQuantidade(dados.quantidade());
        }

        if(dados.idCotacao() != null){
            Cotacao cotacao = this.cotacaoRepository.findById(dados.idCotacao())
                    .orElseThrow(() -> new EntityNotFoundException("Cotacao não encontrada"));

            orcamentoSimilar.setCotacao(cotacao);
            orcamentoSimilar.setValorAtacado(cotacao.getValorUnitario());
            orcamentoSimilar.setValorVarejo(
                    cotacao.getValorUnitario().multiply(cotacao.getMargem().getValorMargem()));

            orcamento.setValorTotal(
                    orcamento.getValorTotal().add(orcamentoSimilar.getValorVarejo()));
        }

        this.orcamentoSimilarRepository.save(orcamentoSimilar);
        this.orcamentoRepository.save(orcamento);

        return orcamento;
    }

    public void deletarItemDoOrcamento(Long idOrcamento, Long idSimilar) {
        if (!orcamentoRepository.existsById(idOrcamento)) {
            throw new EntityNotFoundException("Orçamento não encontrado");
        }

        Optional<OrcamentoSimilar> orcamentoSimilarOptional =
                orcamentoSimilarRepository
                        .findOrcamentoSimilarByOrcamento_OrcamentoIdAndSimilar_SimilarId(idOrcamento, idSimilar);

        if (orcamentoSimilarOptional.isEmpty()) {
            throw new EntityNotFoundException("Relação Orcamento-Similar não encontrada");
        }

        orcamentoSimilarRepository.delete(orcamentoSimilarOptional.get());
    }

    public void deletarOrcamento(Long idOrcamento) {
        if (!orcamentoRepository.existsById(idOrcamento)) {
            throw new EntityNotFoundException("Orçamento não encontrado");
        }

        this.orcamentoRepository.deleteById(idOrcamento);
    }

    //Transforma um OrcamentoSimilarDTO numa entidade pra ser salva no banco
    private OrcamentoSimilar criarOrcamentoSimilarModel(OrcamentoSimilarDTO produto, Orcamento orcamento) {
        Similar similar = produtoSimilarRepository.findById(produto.idSimilar())
                .orElseThrow(() -> new EntityNotFoundException("Similar não encontrado"));

        OrcamentoSimilar item = OrcamentoSimilar.builder()
                .similar(similar)
                .orcamento(orcamento)
                .quantidade(produto.quantidade())
                .marcaDaMaquina(produto.marcaMaquina())
                .tipoDeMaquina(produto.tipoDeMaquina())
                .build();

        if (produto.idCotacao() != null) {
            Cotacao cotacao = cotacaoRepository.findById(produto.idCotacao())
                    .orElseThrow(() -> new EntityNotFoundException("Cotação não encontrada!"));

            item.setValorAtacado(cotacao.getValorUnitario());
            item.setValorVarejo(cotacao.getValorUnitario().multiply(cotacao.getMargem().getValorMargem()));
        }

        return item;
    }

    //Transforma uma lista de entidades OrçamentoSimilar em dtos pra listagem
    private List<ListagemOrcamentoSimilarDTO> criarListagemOrcamentoSimilarDTO(List<OrcamentoSimilar> itens) {
        return itens.stream()
                .map(i -> ListagemOrcamentoSimilarDTO.builder()
                        .similarId(i.getSimilar().getSimilarId())
                        .nomeSimilar(i.getSimilar().getReferencia())
                        .marcaSimilar(i.getMarcaDaMaquina())
                        .tipoDeMaquina(i.getTipoDeMaquina())
                        .quantidade(i.getQuantidade())
                        .valorAtacado(i.getValorAtacado())
                        .valorVarejo(i.getValorVarejo())
                        .build())
                .toList();
    }

}
