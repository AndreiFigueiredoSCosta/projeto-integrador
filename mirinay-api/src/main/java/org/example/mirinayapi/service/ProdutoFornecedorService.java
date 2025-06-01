package org.example.mirinayapi.service;

import jakarta.validation.Valid;
import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.fornecedorClonagem.DTO.CadastrarFornecedorClonagemDTO;
import org.example.mirinayapi.model.fornecedorClonagem.DTO.ListagemFornecedorClonagem;
import org.example.mirinayapi.model.fornecedorClonagem.FornecedorClonagem;
import org.example.mirinayapi.model.fornecedorClonagem.repositories.FornecedorClonagemRepository;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.produto.repositories.ProdutoRepository;
import org.example.mirinayapi.model.produtoFornecedor.DTO.*;
import org.example.mirinayapi.model.clonagem.repositories.ClonagemRepository;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.fornecedor.repositories.FornecedorRepository;
import org.example.mirinayapi.model.produtoFornecedor.repositories.ProdutoFornecedorRepository;
import org.example.mirinayapi.model.produtoClonagem.DTO.CadastrarProdutoClonagemDTO;
import org.example.mirinayapi.model.produtoClonagem.DTO.ListagemProdutoClonagem;
import org.example.mirinayapi.model.produtoClonagem.DTO.ListagemSimilaresProdutoFornecedor;
import org.example.mirinayapi.model.produtoClonagem.ProdutoClonagem;
import org.example.mirinayapi.model.produtoClonagem.repositories.ProdutoClonagemRepository;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.model.similar.repositories.ProdutoSimilarRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Service

public class ProdutoFornecedorService {

    public final ProdutoFornecedorRepository repository;
    private final ProdutoSimilarRepository similarRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ClonagemRepository clonagemRepository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoClonagemRepository produtoClonagemRepository;
    private final FornecedorClonagemRepository fornecedorClonagemRepository;

    public ProdutoFornecedorService(ProdutoFornecedorRepository repository, ProdutoSimilarRepository similarRepository, FornecedorRepository fornecedorRepository, ClonagemRepository clonagemRepository, ProdutoRepository produtoRepository, ProdutoClonagemRepository produtoClonagemRepository, FornecedorClonagemRepository fornecedorClonagemRepository) {
        this.repository = repository;
        this.similarRepository = similarRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.clonagemRepository = clonagemRepository;
        this.produtoRepository = produtoRepository;
        this.produtoClonagemRepository = produtoClonagemRepository;
        this.fornecedorClonagemRepository = fornecedorClonagemRepository;
    }

    public List<ListagemSimilaresProdutoFornecedor> listarSimilaresDeProduto(Long clonagemId, Long produtoId) {
        assertClonagem(clonagemId);

        List<ListagemSimilaresProdutoFornecedor> similares = this.repository.findAllByProdutoId(clonagemId, produtoId);
        if (similares.isEmpty()) {
            return null;
        }

        return similares;
    }

    public List<ListagemProdutoClonagem> findProdutosClonagemId(Long clonagemId) {
        assertClonagem(clonagemId);

        List<ListagemProdutoClonagem> produtos = repository.findProdutosByClonagem(clonagemId);
        if (produtos.isEmpty()) {
            return null;
        }
        return produtos;
    }

    public List<ListagemFornecedorClonagem> findFornecedoresClonagemId(Long clonagemId) {
        assertClonagem(clonagemId);

        List<ListagemFornecedorClonagem> fornecedores = repository.findFornecedoresByClonagem(clonagemId);
        if (fornecedores.isEmpty()) {
            return null;
        }
        return fornecedores;
    }

    public ResponseEntity<?> cadastrarFornecedor(@Valid CadastrarFornecedorClonagemDTO fornecedorClonagem) {
        try {
            Optional<Clonagem> ac = assertClonagem(fornecedorClonagem.clonagemId());
            if (ac.isEmpty()) {
                return ResponseEntity.badRequest().body("Clonagem não encontrada");
            }

            Optional<Fornecedor> af = assertFornecedor(fornecedorClonagem.fornecedorId());
            if (af.isEmpty()) {
                return ResponseEntity.badRequest().body("Fornecedor não encontrado");
            }

            if (fornecedorClonagemRepository.existsByFornecedorAndClonagem(af.get().getFornecedorId(), ac.get().getClonagemId())) {
                return ResponseEntity.badRequest().body("O fornecedor já está cadastrado nessa clonagem");
            }

            FornecedorClonagem fc = FornecedorClonagem.builder()
                    .clonagem(ac.get())
                    .fornecedor(af.get())
                    .build();

            FornecedorClonagem savedEntity = this.fornecedorClonagemRepository.save(fc);

            // TEMPORÁRIO ATÉ RESOLVER O AUMENTO NO VOLUME DE DADOS
            List<Similar> similares = produtoClonagemRepository.findAllByClonagemId(fornecedorClonagem.clonagemId());

            similares.forEach(similar -> {
                ProdutoFornecedor ic = ProdutoFornecedor.builder()
                        .clonagem(ac.get())
                        .produto(similar)
                        .status(true)
                        .fornecedor(af.get())
                        .build();
                this.repository.save(ic);
            });
            // FIM DO TRECHO TEMPORÁRIO

            return ResponseEntity.ok(savedEntity);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao cadastrar fornecedor na clonagem: " + e.getMessage());
        }
    }

    public ResponseEntity<?> cadastrarProduto(@Valid CadastrarProdutoClonagemDTO produtoClonagem) {
        try {
            Optional<Clonagem> ac = assertClonagem(produtoClonagem.clonagemId());
            if (ac.isEmpty()) {
                return ResponseEntity.badRequest().body("Clonagem não encontrada");
            }

            return cadastrarTodosSimilaresDeProduto(ac.get(), produtoClonagem.similares());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao cadastrar produtos na clonagem: " + e.getMessage());
        }
    }

    private ResponseEntity<?> cadastrarTodosSimilaresDeProduto(Clonagem clonagem, List<Long> similaresIds) {
        AtomicReference<Integer> count = new AtomicReference<>(0);

        List<Similar> similares = similarRepository.findAllByIds(similaresIds);

        similares.forEach(similar -> {
            if (!produtoClonagemRepository.existsByProdutoAndClonagem(similar.getSimilarId(), clonagem.getClonagemId())) {
                ProdutoClonagem pc = ProdutoClonagem.builder()
                        .clonagem(clonagem)
                        .similar(similar)
                        .build();
                this.produtoClonagemRepository.save(pc);
                count.getAndSet(count.get() + 1);
            }
        });

        if (count.get() == 0) {
            return ResponseEntity.badRequest().body("Todos os similares do produto já estão cadastrados nessa clonagem");
        } else if (count.get() < similares.size()) {
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body("Alguns similares do produto já estavam cadastrados nessa clonagem");
        }

        // TEMPORÁRIO ATÉ RESOLVER O AUMENTO NO VOLUME DE DADOS
        List<Fornecedor> fornecedores = fornecedorClonagemRepository.findAllByClonagemId(clonagem.getClonagemId());

        fornecedores.forEach(fornecedor -> similares.forEach(similar -> {
            ProdutoFornecedor ic = ProdutoFornecedor.builder()
                    .clonagem(clonagem)
                    .fornecedor(fornecedor)
                    .produto(similar)
                    .status(true)
                    .build();
            this.repository.save(ic);
        }));
        // FIM DO TRECHO TEMPORÁRIO

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> deletarFornecedor(Long fornecedorId, Long clonagemId) {
        Optional<Clonagem> clonagem = assertClonagem(clonagemId);
        if (clonagem.isEmpty()) {
            return ResponseEntity.badRequest().body("Clonagem não encontrada");
        }

        Optional<Fornecedor> fornecedor = assertFornecedor(fornecedorId);
        if (fornecedor.isEmpty()) {
            return ResponseEntity.badRequest().body("Fornecedor não encontrado");
        }

        Optional<FornecedorClonagem> fc = this.fornecedorClonagemRepository.findByFornecedorAndClonagem(fornecedor.get().getFornecedorId(), clonagem.get().getClonagemId());
        if (fc.isEmpty()) {
            return ResponseEntity.badRequest().body("Fornecedor não encontrado na clonagem");
        }
        //TODO: não deleta os ProdutoFornecedor
        this.fornecedorClonagemRepository.delete(fc.get());
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> deletarProduto(Long produtoId, Long clonagemId) {
        Optional<Clonagem> clonagem = assertClonagem(clonagemId);
        if (clonagem.isEmpty()) {
            return ResponseEntity.badRequest().body("Clonagem não encontrada");
        }

        Optional<Produto> produto = assertProduto(produtoId);
        if (produto.isEmpty()) {
            return ResponseEntity.badRequest().body("Produto não encontrado");
        }

        this.similarRepository.findSimilaresByProdutoId(produtoId).forEach(similar -> {
            Optional<ProdutoClonagem> pc = this.produtoClonagemRepository.findBySimilarAndClonagem(similar.getSimilarId(), clonagem.get().getClonagemId());
            pc.ifPresent(this.produtoClonagemRepository::delete);
        });

        //TODO: não deleta os ProdutoFornecedor
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> deletarSimilar(Long similarId, Long clonagemId) {
        Optional<Clonagem> clonagem = assertClonagem(clonagemId);
        if (clonagem.isEmpty()) {
            return ResponseEntity.badRequest().body("Clonagem não encontrada");
        }

        Optional<Similar> similar = assertSimilar(similarId);
        if (similar.isEmpty()) {
            return ResponseEntity.badRequest().body("Similar não encontrado");
        }

        Optional<ProdutoClonagem> pc = this.produtoClonagemRepository.findBySimilarAndClonagem(similar.get().getSimilarId(), clonagem.get().getClonagemId());
        if (pc.isEmpty()) {
            return ResponseEntity.badRequest().body("Similar não encontrado na clonagem");
        }

        this.produtoClonagemRepository.delete(pc.get());

        //TODO: não deleta os ProdutoFornecedor
        return ResponseEntity.noContent().build();
    }

    // Métodos auxiliares
    private Optional<Clonagem> assertClonagem(Long clonagemId) {
        return clonagemRepository.findById(clonagemId);
    }

    private Optional<Produto> assertProduto(Long produtoId) {
        return produtoRepository.findById(produtoId);
    }

    private Optional<Similar> assertSimilar(Long similarId) {
        return similarRepository.findById(similarId);
    }

    private Optional<Fornecedor> assertFornecedor(Long fornecedorId) {
        return fornecedorRepository.findById(fornecedorId);
    }






    // -------- Métodos antigos, que serão removidos em versões futuras -------- //



//    public ResponseEntity<?> cadastrarProdutoFornecedor(CadastrarProdutoClonagemDTO grupoFornecedor) {
//        try {
//            Optional<Fornecedor> fornecedorOpt = fornecedorRepository.findById(grupoFornecedor.fornecedorId());
//            if (fornecedorOpt.isEmpty()) {
//                return ResponseEntity.badRequest().body("Fornecedor não encontrado");
//            }
//            Optional<Similar> similarOpt = produtoSimilarRepository.findById(grupoFornecedor.similarId());
//            if (similarOpt.isEmpty()) {
//                return ResponseEntity.badRequest().body("Produto produto não encontrado");
//            }
//            Optional<Clonagem> clonagemOpt = clonagemRepository.findById(grupoFornecedor.clonagemId());
//            if (clonagemOpt.isEmpty()) {
//                return ResponseEntity.badRequest().body("Clonagem não encontrada");
//            }
//            // Verificar se já existe um registro com os mesmos dados
//            boolean exists = repository.existsByFornecedorAndProdutoAndClonagem(
//                    fornecedorOpt.get(),
//                    similarOpt.get(),
//                    clonagemOpt.get()
//            );
//            if (exists) {
//                return ResponseEntity.badRequest().body("Já existe um registro com essa combinação de fornecedor, produto e clonagem");
//            }
//            // Criar e salvar o ProdutoFornecedor
//            ProdutoFornecedor produtoFornecedor = ProdutoFornecedor.builder()
//                    .fornecedor(fornecedorOpt.get())
//                    .produto(similarOpt.get())
//                    .clonagem(clonagemOpt.get())
//                    .status(true)
//                    .build();
//            ProdutoFornecedor savedEntity = repository.save(produtoFornecedor);
//            return ResponseEntity.ok(savedEntity);
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao cadastrar ProdutoFornecedor: " + e.getMessage());
//        }
//    }
    @Deprecated
    public String editarProdutoFornecedor(EditarProdutoFornecedorDTO grupoFornecedor) {
        ProdutoFornecedor produtoFornecedor = this.repository.getReferenceById(grupoFornecedor.codigo());

        Fornecedor fornecedor = fornecedorRepository.findById(grupoFornecedor.fornecedorId()).orElse(null);
        if (fornecedor == null) {
            return "Fornecedor não encontrado";
        }
        Similar similar = similarRepository.findById(grupoFornecedor.similarId()).orElse(null);
        if (similar == null) {
            return "Produto idSimilar não encontrado";
        }
        Clonagem clonagem = clonagemRepository.findById(grupoFornecedor.clonagemId()).orElse(null);
        if (clonagem == null) {
            return "Clonagem não encontrada";
        }
        ProdutoFornecedor produtoFornecedor1 = ProdutoFornecedor.builder()
                .produtoFornecedorId(grupoFornecedor.codigo())
                .fornecedor(fornecedor)
                .produto(similar)
                .clonagem(clonagem)
                .status(true)
                .build();


        produtoFornecedor.setStatus(true);

        this.repository.save(produtoFornecedor);
        return "Editado com sucesso";
    }
    @Deprecated
    public void deletarProdutoFornecedor(Long codigo) {
        this.repository.deleteById(codigo);
    }

    @Deprecated
    public List<ListagemGrupoProdutoFornecedor> listarProdutosFornecedores() {
        List <ProdutoFornecedor> produtoFornecedor = this.repository.findAll();
        if (produtoFornecedor.isEmpty()) {
            return List.of();
        }
//        return produtoFornecedor.stream().map(produtoFornecedor1 -> {
//            if (produtoFornecedor1.getFornecedor() == null) {
//                return null;
//            }
//            return new ListagemGrupoProdutoFornecedor(
//                    produtoFornecedor1.getProdutoFornecedorId(),
//                    produtoFornecedor1.getProduto().getReferencia(),
//                    produtoFornecedor1.getFornecedor().getNome()
//
//            );
//        }).toList();
        return null;
    }
    @Deprecated
    public Optional<ProdutoFornecedor> listarProdutoFornecedor(Long codigo) {
        return this.repository.findById(codigo);
    }
}