package org.example.mirinayapi.service;

import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.clonagem.repositories.ClonagemRepository;
import org.example.mirinayapi.model.enums.TipoProdutoEnum;
import org.example.mirinayapi.model.grupo.Grupo;
import org.example.mirinayapi.model.grupo.dto.GruposProdutosDTO;
import org.example.mirinayapi.model.grupo.repositories.GrupoRepository;
import org.example.mirinayapi.model.marca.repositories.MarcaRepository;
import org.example.mirinayapi.model.produto.DTO.CadastroProdutoDTO;
import org.example.mirinayapi.model.produto.DTO.DetalhesProdutoDTO;
import org.example.mirinayapi.model.produto.DTO.ProdutoSimplesDTO;
import org.example.mirinayapi.model.produto.DTO.ProdutosDTO;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.produto.repositories.ProdutoRepository;
import org.example.mirinayapi.model.similar.DTO.SimilarDTO;
import org.example.mirinayapi.model.similar.DTO.SimilarDetalhesDTO;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.model.similar.repositories.ProdutoSimilarRepository;
import org.example.mirinayapi.model.subgrupo.SubGrupo;
import org.example.mirinayapi.model.subgrupo.dto.SGProdutosDTO;
import org.example.mirinayapi.model.subgrupo.repositories.SubGrupoRepository;
import org.example.mirinayapi.model.unidade.Unidade;
import org.example.mirinayapi.model.unidade.repositories.UnidadeRepositories;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;
    private final GrupoRepository grupoRepository;
    private final SubGrupoRepository subGrupoRepository;
    private final ProdutoSimilarRepository similarRepository;
    private final MarcaRepository marcaRepository;
    private final UnidadeRepositories unidadeRepository;
    private final ClonagemRepository clonagemRepository;
    private final SubGrupoService subGrupoService;
    private final UnidadeService unidadeService;

    public ResponseEntity<?> cadastrarProduto(CadastroProdutoDTO cadastroProdutoDTO) throws BadRequestException {
        Produto produto = this.saveProduto(cadastroProdutoDTO);
        return ResponseEntity.ok(produto);
    }

    public void inserirProdutoComponente(Long idProduto, Long idComponente) {
        Optional<Produto> optionalProduto = repository.findByIdAndStatusIsTrue(idProduto);
        if (optionalProduto.isEmpty()) {
            throw new RuntimeException("Produto não encontrado");
        }

        Optional<Produto> componenteBanco = repository.findByIdAndStatusIsTrue(idComponente);
        if (componenteBanco.isEmpty()) {
            throw new RuntimeException("Componente não encontrado");
        }

        Produto produto = optionalProduto.get();
        produto.setTipo(TipoProdutoEnum.CONJUNTO);

        if (produto.getComponentes().contains(componenteBanco.get())) {
            throw new RuntimeException("Componente já adicionado ao produto");
        }

        produto.getComponentes().add(componenteBanco.get());
        repository.save(produto);
    }
    public List<Produto> buscarProdutos() {
        return repository.findAllByStatusIsTrue();
    }

    public List<DetalhesProdutoDTO> buscarDetalhesProduto(Long id) {

         List<Produto> produtos = repository.findProdutoDetalhadoById(id);
        return produtos.stream().map(produto -> {
            return new DetalhesProdutoDTO(
                    produto.getProdutoId(),
                    produto.getNome(),
                    produto.getDescricao(),
                    produto.getUnidade().getNome(),
                    produto.getSubgrupo().getGrupo().getNome(),
                    produto.getSubgrupo().getNome()
            );
        }).collect(Collectors.toList());
    }

    private List<GruposProdutosDTO> mapearParaDTO(List<Grupo> grupos) {
        return grupos.stream().map(grupo -> {
            List<SGProdutosDTO> subgruposDTO = grupo.getSubgrupos().stream()
                    .map(subgrupo -> new SGProdutosDTO(
                            subgrupo.getSubgrupoId(),
                            subgrupo.getNome(),
                            subgrupo.getDescricao(),
                            subgrupo.getProdutos().stream()
                                    .map(produto -> new ProdutosDTO(
                                            produto.getProdutoId(),
                                            produto.getNome()))
                                    .toList()))
                    .toList();

            return new GruposProdutosDTO(grupo.getGrupoId(), grupo.getNome(), grupo.getDescricao(), subgruposDTO);
        }).toList();
    }

    public List<ProdutoSimplesDTO> buscarProdutosComponentes(Long id) {
        List<Produto> produtos = repository.findProdutosComponentesById(id);
        return produtos.stream()
                .map(produto -> new ProdutoSimplesDTO(produto.getProdutoId(), produto.getNome()))
                .collect(Collectors.toList());
    }

    public ResponseEntity<List<ProdutoSimplesDTO>> buscarConjuntosQueProdutoFazParte(Long idProduto) {

        Produto produto = repository.findByIdAndStatusIsTrue(idProduto)
            .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

        // Retornar todos os conjuntos que contêm este produto como componente
        List<ProdutoSimplesDTO> conjuntosDTO = produto.getConjuntos().stream()
                .map(p -> {
                    if (p.getStatus()) {
                        return new ProdutoSimplesDTO(p.getProdutoId(), p.getNome());
                    }

                    return null;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(conjuntosDTO);
    }

    public List<GruposProdutosDTO> buscarProdutosPorNomeOuCodigo(String descricao) {
        List<Grupo> grupo = repository.findProdutoByDescricao(descricao);

        return mapearParaDTO(grupo);
    }

    public List<SelectDTO> buscarProdutosPorNomeOuCodigoSelect(String descricao) {
        List<Produto> produtos = repository.findProdutoByNome(descricao);
        return produtos.stream()
                .map(produto -> new SelectDTO
                        (produto.getProdutoId(), produto.getNome())).collect(Collectors.toList());
    }
    public List<GruposProdutosDTO> listarGruposComProdutosESimilares(Pageable pageable) {
        Page<Grupo> grupoPage = grupoRepository.findAllGrupos(pageable);
        List<GruposProdutosDTO> grupoDTOList = new ArrayList<>();

        for (Grupo grupo : grupoPage.getContent()) {
            List<SubGrupo> subGrupos = subGrupoRepository.findSubGruposByGrupoId(grupo.getGrupoId());
            List<SGProdutosDTO> subGrupoDTOList = new ArrayList<>();

            for (SubGrupo subgrupo : subGrupos) {
                List<Produto> produtos = repository.findProdutosBySubgrupoId(subgrupo.getSubgrupoId());

                List<ProdutosDTO> produtoDTOList = new ArrayList<>();

                for (Produto produto : produtos) {
                    List<Similar> similares = similarRepository.findSimilaresByProdutoId(produto.getProdutoId());
                    List<SimilarDTO> similarDTOList = similares.stream()
                            .map(similar -> new SimilarDTO(similar.getSimilarId(), similar.getReferencia(),  similar.getMarca().getId(), similar.getObservacao()))
                            .collect(Collectors.toList());

                    ProdutosDTO produtoDTO = new ProdutosDTO(produto.getProdutoId(), produto.getDescricao(), similarDTOList);
                    produtoDTOList.add(produtoDTO);
                }

                subGrupoDTOList.add(new SGProdutosDTO(subgrupo.getSubgrupoId(), subgrupo.getNome(), subgrupo.getDescricao(), produtoDTOList));
            }

            grupoDTOList.add(new GruposProdutosDTO(grupo.getGrupoId(), grupo.getNome(), grupo.getDescricao(), subGrupoDTOList));
        }

        return grupoDTOList;
    }

    public List<SimilarDetalhesDTO> buscarProdutoPorId(Long id) {
        List<Similar> produtos = similarRepository.findSimilaresByProdutoId(id);
        return produtos.stream().map(produto -> {
            return new SimilarDetalhesDTO(
                    produto.getSimilarId(),
                    produto.getReferencia(),
                    produto.getMarca().getId(),
                    produto.getMarca().getNome(),
                    produto.getObservacao()
            );
        }).collect(Collectors.toList());
    }
    public ResponseEntity<Produto> editarProduto(Long id, CadastroProdutoDTO produtoDTO) {
        Produto p = repository.findByIdAndStatusIsTrue(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        Optional<SubGrupo> subGrupo = subGrupoRepository.findSubGrupoByIdAndStatusIsTrue(produtoDTO.subgrupoId());
        if (subGrupo.isEmpty()) {
            throw new RuntimeException("Subgrupo não encontrado");
        }

        Optional<Unidade> unidade = unidadeRepository.findByIdAndStatusIsTrue(produtoDTO.unidadeId());
        if (unidade.isEmpty()) {
            throw new RuntimeException("Unidade não encontrada");
        }

        p.setNome(produtoDTO.nome());
        p.setDescricao(produtoDTO.descricao());
        p.setSubgrupo(subGrupo.get());
        p.setUnidade(unidade.get());

        return ResponseEntity.ok(repository.save(p));
    }

    public void excluirProduto(Long id) {
        Produto produto = repository.getReferenceById(id);
        produto.setStatus(false);
        repository.save(produto);
    }

    public List<ProdutoSimplesDTO> listarProdutos(Pageable pageable) {
        return repository.findAllProdutoByStatusIsTrue(pageable).stream()
                .map(produto -> new ProdutoSimplesDTO(produto.getProdutoId(), produto.getNome()))
                .collect(Collectors.toList());
    }

    public void removerProdutoComponente(Long produtoId, Long componenteId) {
        Optional<Produto> optionalProduto = repository.findByIdAndStatusIsTrue(produtoId);
        if (optionalProduto.isEmpty()) {
            throw new RuntimeException("Produto não encontrado");
        }

        Optional<Produto> componenteBanco = repository.findByIdAndStatusIsTrue(componenteId);
        if (componenteBanco.isEmpty()) {
            throw new RuntimeException("Componente não encontrado");
        }

        Produto produto = optionalProduto.get();

        if (!produto.getComponentes().contains(componenteBanco.get())) {
            throw new RuntimeException("Componente não presente no produto");
        }

        produto.getComponentes().remove(componenteBanco.get());
        repository.save(produto);
    }

    public List<SelectDTO> buscarSimlaresPorNomeOuCodigoSelect(String label) {
        List<Similar> similares = repository.findSimilarByNome(label);
        return similares.stream()
                .map(similar -> new SelectDTO
                        (similar.getSimilarId(), similar.getReferencia())).collect(Collectors.toList());
    }

    public List<SelectDTO> buscarClonagensDeSimilar(Long similarId) {
        Similar similar = similarRepository.findByIdAndStatusIsTrue(similarId)
                .orElseThrow(() -> new RuntimeException("Similar não encontrado"));

        List<Clonagem> clonagens = clonagemRepository.findClonagensBySimilarId(similar.getSimilarId());

        return clonagens.stream()
                .map(c -> new SelectDTO(c.getClonagemId(), c.getNome()))
                .collect(Collectors.toList());
    }

    public Produto assertProduto(Long produtoId) {
        return repository.findByIdAndStatusIsTrue(produtoId).orElseThrow(() -> new BadCredentialsException("Produto não encontrado"));
    }

    public Produto saveProduto(CadastroProdutoDTO produto) throws BadRequestException {
        SubGrupo subGrupo = subGrupoService.assertSubGrupo(produto.subgrupoId());
        Unidade unidade = unidadeService.assertUnidade(produto.unidadeId());

        Produto p = Produto.builder()
                .nome(produto.nome())
                .descricao(produto.descricao())
                .tipo(TipoProdutoEnum.SIMPLES)
                .status(true)
                .subgrupo(subGrupo)
                .unidade(unidade)
                .build();

        return repository.save(p);
    }
}
