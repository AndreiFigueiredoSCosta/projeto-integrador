package org.example.mirinayapi.service;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.produto.repositories.ProdutoRepository;
import org.example.mirinayapi.model.unidade.Unidade;
import org.example.mirinayapi.model.unidade.repositories.UnidadeRepositories;
import org.example.mirinayapi.model.unidadePossui.UnidadePossui;
import org.example.mirinayapi.model.unidadePossui.UnidadePossuiId;
import org.example.mirinayapi.model.unidadePossui.dto.CadastroPossuiDTO;
import org.example.mirinayapi.model.unidadePossui.repositories.UnidadePossuiRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UnidadePossuiService {

    private final UnidadePossuiRepository repository;
    private final UnidadeRepositories unidadeRepositories;
    private final ProdutoRepository produtoRepository;
    public UnidadePossui save(CadastroPossuiDTO unidadePossuiDTO) {
        System.out.println(unidadePossuiDTO.unidadeId() + " " +
                unidadePossuiDTO.produtoId() + " " +
                unidadePossuiDTO.quantidade());

        // Busca a Unidade
        Unidade unidade = unidadeRepositories.findById(unidadePossuiDTO.unidadeId())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada"));

        // Busca o Produto
        Produto produto = produtoRepository.findById(unidadePossuiDTO.produtoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        UnidadePossuiId id = new UnidadePossuiId();
        id.setUnidadeId(unidade.getUnidadeId());
        id.setProdutoId(produto.getProdutoId());

        // Criação da entidade UnidadePossui
        UnidadePossui unidadePossui = new UnidadePossui();
        unidadePossui.setId(id);
        unidadePossui.setUnidade(unidade);
        unidadePossui.setProduto(produto);
        unidadePossui.setQuantidade(Math.toIntExact(unidadePossuiDTO.quantidade()));
        unidadePossui.setStatus(true);

        // Salva a entidade
        return repository.save(unidadePossui);
    }
    public List<UnidadePossui> findAll() {
        return null;
    }

    public UnidadePossui findById(Long id) {
        return null;
    }

    public UnidadePossui update(Long id, UnidadePossui unidadePossui) {
        return null;
    }

    public void delete(Long id) {
    }
}
