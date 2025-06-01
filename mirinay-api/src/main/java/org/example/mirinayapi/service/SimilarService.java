package org.example.mirinayapi.service;


import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.enums.ProdutoEnum;
import org.example.mirinayapi.model.fabricante.repositories.FabricanteRepository;
import org.example.mirinayapi.model.marca.Marca;
import org.example.mirinayapi.model.marca.repositories.MarcaRepository;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.produto.repositories.ProdutoRepository;
import org.example.mirinayapi.model.similar.DTO.SubmitSimilarDTO;
import org.example.mirinayapi.model.similar.DTO.SimilarDetalhesDTO;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.model.similar.repositories.ProdutoSimilarRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class SimilarService {

    private final ProdutoSimilarRepository repository;
    private final ProdutoRepository produtoRepository;
    private final FabricanteRepository fabricanteRepository;
    private final MarcaRepository marcaRepository;
    private final ProdutoService produtoService;
    private final MarcaService marcaService;

    public Similar findSimilarById(Long id) {
        Optional<Similar> similar = repository.findByIdAndStatusIsTrue(id);
        return similar.orElse(null);
    }
    public ResponseEntity<?> cadastrarProdutoSimilar(SubmitSimilarDTO similarDTO, Long id) throws BadRequestException {
        return ResponseEntity.ok(this.saveSimilar(similarDTO, id));
    }

    public void editarProdutoSimilar(SubmitSimilarDTO produto, Long id) {
        Optional<Similar> produtoOptional = repository.findByIdAndStatusIsTrue(id);
        if (produtoOptional.isPresent()) {
            Optional<Marca> marcaOptional = marcaRepository.findMarcaByIdAndStatusIsTrue(produto.idMarca());

            if (marcaOptional.isEmpty()) {
                throw new RuntimeException("Marca não encontrada");
            }

            Similar similar = produtoOptional.get();

            similar.setReferencia(produto.referencia());
            similar.setObservacao(produto.observacao());
            similar.setMarca(marcaOptional.get());

            repository.save(similar);
            ResponseEntity.ok(produto);
        }
    }

    public void excluirProdutoSimilar(Long id) {
        Optional<Similar> produtoOptional = repository.findById(id);
        if (produtoOptional.isPresent()) {
            Similar similar = produtoOptional.get();
            similar.setStatus(false);
            repository.save(similar);
        }
    }

    public SimilarDetalhesDTO buscarSimilarPorId(Long id) {
        Optional<Similar> similar = repository.findByIdAndStatusIsTrue(id);

        return similar.map(value -> new SimilarDetalhesDTO(
                value.getSimilarId(),
                value.getReferencia(),
                value.getMarca().getId(),
                value.getMarca().getNome(),
                value.getObservacao()
        )).orElse(null);
    }

    public Similar assertSimilar(Long similarId) throws BadRequestException {
        Optional<Similar> similar = repository.findByIdAndStatusIsTrue(similarId);
        if (similar.isEmpty()) {
            throw new BadRequestException("Similar não encontrada");
        }

        return similar.get();
    }

    public Similar getByReferencia(String referencia) {
        Optional<Similar> similar = repository.findSimilarByReferenciaAndStatusIsTrue(referencia);
        return similar.orElse(null);
    }

    public Similar saveSimilar(SubmitSimilarDTO similarDTO, Long produtoId) throws BadRequestException {
        Produto produto = produtoService.assertProduto(produtoId);
        Marca marca = null;
        if (similarDTO.idMarca() != null) {
            marca = marcaService.assertMarca(similarDTO.idMarca());
        }

        Similar similar = Similar.builder()
                .referencia(similarDTO.referencia())
                .tipo(ProdutoEnum.FILHO)
                .observacao(similarDTO.observacao())
                .marca(marca)
                .produto(produto)
                .status(true)
                .build();

        return repository.save(similar);
    }
}
