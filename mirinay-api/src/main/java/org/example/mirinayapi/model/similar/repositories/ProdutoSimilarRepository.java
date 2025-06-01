package org.example.mirinayapi.model.similar.repositories;

import org.example.mirinayapi.model.similar.Similar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProdutoSimilarRepository extends JpaRepository<Similar, Long> {
    Optional<Similar> findById(Long id);
    List<Similar> findAll();

    Similar findSimilarByReferencia(String referencia);
    @Query("SELECT p FROM produto p WHERE p.subgrupo.subgrupoId = :subgrupoId")
    List<Similar> findProdutosBySubgrupoId(@Param("subgrupoId") Long subgrupoId);

    @Query("SELECT p FROM produto_similar p " +
            "INNER JOIN p.produto pg " +
            "WHERE p.produto.produtoId = :produtoId and p.status = true and pg.status = true")
    List<Similar> findSimilaresByProdutoId(@Param("produtoId") Long produtoId);

    @Query("SELECT p FROM produto_similar p " +
            "INNER JOIN p.produto pg " +
            "WHERE p.similarId = :id and p.status = true and pg.status = true")
    Optional<Similar> findByIdAndStatusIsTrue(Long id);

    @Query("SELECT p FROM produto_similar p " +
            "INNER JOIN p.produto pg " +
            "WHERE p.similarId IN :similaresIds and p.status = true and pg.status = true")
    List<Similar> findAllByIds(List<Long> similaresIds);

    @Query("SELECT p FROM produto_similar p " +
            "INNER JOIN p.produto pg " +
            "WHERE LOWER(p.referencia) = LOWER(:referencia) and p.status = true and pg.status = true")
    Optional<Similar> findSimilarByReferenciaAndStatusIsTrue(String referencia);
}
