package org.example.mirinayapi.model.unidadePossui.repositories;

import org.example.mirinayapi.model.unidadePossui.UnidadePossui;
import org.example.mirinayapi.model.unidadePossui.UnidadePossuiId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UnidadePossuiRepository extends JpaRepository<UnidadePossui, Long> {

    List<UnidadePossui> findAllByProdutoProdutoId(Long produtoId);
    List<UnidadePossui> findAllByUnidadeUnidadeId(Long unidadeId);

    List<UnidadePossui> findByProduto_ProdutoId(Long produtoId);

    @Query("SELECT up.quantidade FROM UnidadePossui up WHERE up.produto.produtoId = :produtoId and up.unidade.unidadeId = :unidadeId")
    Integer findQuantidadeByProduto_ProdutoIdAndUnidade_UnidadeId(Long produtoId, Long unidadeId);

}
