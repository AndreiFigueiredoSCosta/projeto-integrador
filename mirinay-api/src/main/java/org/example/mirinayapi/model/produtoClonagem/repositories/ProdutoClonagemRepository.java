package org.example.mirinayapi.model.produtoClonagem.repositories;

import org.example.mirinayapi.model.produtoClonagem.ProdutoClonagem;
import org.example.mirinayapi.model.similar.Similar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProdutoClonagemRepository extends JpaRepository<ProdutoClonagem, Long> {

    @Query(value = """
            SELECT s
            FROM produto_similar s
            JOIN produto_clonagem pc ON s.similarId = pc.similar.similarId
            WHERE pc.clonagem.clonagemId = :clonagemId
            """)
    List<Similar> findAllByClonagemId(
            @Param("clonagemId") Long clonagemId
    );

    @Query(value = """
            SELECT COUNT(*) > 0
            FROM produto_clonagem pc
            WHERE pc.similar_id = :similarId AND pc.clonagem_id = :clonagemId
            """, nativeQuery = true)
    boolean existsByProdutoAndClonagem(
            @Param("similarId") Long similarId,
            @Param("clonagemId") Long clonagemId
    );

    @Query(value = """
            SELECT pc
            FROM produto_clonagem pc
            WHERE pc.similar.similarId = :similarId AND pc.clonagem.clonagemId = :clonagemId
            """)
    Optional<ProdutoClonagem> findBySimilarAndClonagem(Long similarId, Long clonagemId);
}
