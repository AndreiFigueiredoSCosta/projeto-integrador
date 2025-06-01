package org.example.mirinayapi.model.produtoFornecedor.repositories;

import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.fornecedorClonagem.DTO.ListagemFornecedorClonagem;
import org.example.mirinayapi.model.produtoClonagem.DTO.ListagemProdutoClonagem;
import org.example.mirinayapi.model.produtoClonagem.DTO.ListagemSimilaresProdutoFornecedor;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;
import org.example.mirinayapi.model.similar.Similar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProdutoFornecedorRepository extends JpaRepository<ProdutoFornecedor, Long> {
    boolean existsByFornecedorAndProdutoAndClonagem(Fornecedor fornecedor, Similar produto, Clonagem clonagem);

    @Query(value = """
            SELECT p.produto_id as produtoId,
                       p.nome as produtoNome
                FROM produto_clonagem pc
                JOIN produto_similar ps ON pc.similar_id = ps.similar_id
                JOIN produto p ON ps.produto_id = p.produto_id
                WHERE pc.clonagem_id = :clonagemId
                GROUP BY p.produto_id, p.nome
            """, nativeQuery = true)
    List<ListagemProdutoClonagem> findProdutosByClonagem(
            @Param("clonagemId") Long clonagemId
    );

    @Query(value = """
            SELECT fc.fornecedor_id as fornecedorId,
                   f.nome as fornecedorNome
            FROM fornecedor_clonagem fc
            JOIN fornecedor f ON fc.fornecedor_id = f.fornecedor_id
            WHERE fc.clonagem_id = :clonagemId
            GROUP BY fc.fornecedor_id, f.nome
            """, nativeQuery = true)
    List<ListagemFornecedorClonagem> findFornecedoresByClonagem(
            @Param("clonagemId") Long clonagemId
    );

    @Query(value = """
            SELECT pc.similar_id as similarId,
                   ps.referencia as referencia
            FROM produto_clonagem pc
            JOIN produto_similar ps ON pc.similar_id = ps.similar_id
            WHERE pc.clonagem_id = :clonagemId AND ps.produto_id = :produtoId
            GROUP BY pc.similar_id, ps.referencia
            """, nativeQuery = true)
    List<ListagemSimilaresProdutoFornecedor> findAllByProdutoId(
            @Param("clonagemId") Long clonagemId,
            @Param("produtoId") Long produtoId
    );

    List<ProdutoFornecedor> findAllByClonagem(Clonagem clonagem);
    @Query("SELECT pf FROM produto_fornecedor  pf " +
            "JOIN pf.produto item " +
            "WHERE item.similarId = :itemId")
    List<ProdutoFornecedor> findByProdutoItemRequisicaoItemRequisicaoId(@Param("itemId") Long itemId);


    @Query("SELECT pf FROM produto_fornecedor pf " +
            "JOIN pf.produto p " +
            "WHERE p.similarId = :similarId AND pf.fornecedor = :fornecedor")
    List<ProdutoFornecedor> findAllBySimilarIdAndFornecedor(@Param("similarId") Long similarId, @Param("fornecedor") Fornecedor fornecedor);

    @Query("""
        SELECT s FROM produto_clonagem pc
            JOIN pc.clonagem c
            JOIN pc.similar s
            WHERE c.status = true AND s.status = true AND c.clonagemId = :clonagemId""")
    List<Similar> findAllSimilares(
            @Param("clonagemId") Long clonagemId
    );
}
