package org.example.mirinayapi.model.produto.repositories;

import org.example.mirinayapi.model.grupo.Grupo;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.similar.Similar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findById(Long id);
    List<Produto> findAllByStatusIsTrue();

    @Query("SELECT p FROM produto p WHERE p.subgrupo.subgrupoId = :subgrupoId")
    List<Produto> findProdutosBySubgrupoId(@Param("subgrupoId") Long subgrupoId);

    @Query("SELECT p FROM produto p " +
            "LEFT JOIN FETCH p.subgrupo s " +
            "LEFT JOIN FETCH s.grupo g " +
            "LEFT JOIN FETCH p.produtosSimilares ps " +
            "WHERE p.produtoId = :idProduto")
    List<Produto> findProdutoDetalhadoById(Long idProduto);

    @Query("SELECT DISTINCT g FROM Grupo g " +
            "LEFT JOIN FETCH g.subgrupos sg " +
            "LEFT JOIN FETCH sg.produtos p " +
            "WHERE p.nome LIKE %:descricao%")
    List<Grupo> findProdutoByDescricao(@Param("descricao") String descricao);


    @Query("SELECT p FROM produto p " +
            "inner join p.subgrupo sg" +
            " inner join p.subgrupo.grupo g" +
            " WHERE p.nome LIKE %:nome% AND g.status= true AND sg.status= true and p.status= true")
    List<Produto> findProdutoByNome(@Param("nome") String nome);

    @Query("""
        SELECT ps FROM produto_similar ps
            inner join ps.produto p
            inner join p.subgrupo sg
            inner join p.subgrupo.grupo g
            WHERE p.nome LIKE %:nome% AND g.status= true AND sg.status= true and p.status= true""")
    List<Similar> findSimilarByNome(@Param("nome") String nome);

    @Query("SELECT c FROM produto p JOIN p.componentes c WHERE p.produtoId = :id AND c.status = true")
    List<Produto> findProdutosComponentesById(@Param("id") Long id);

    @Query("SELECT p FROM produto p JOIN p.componentes c WHERE c.produtoId = :idProduto")
    List<Produto> findProdutosQueSãoComponentes(@Param("idProduto") Long idProduto);
    @Query("SELECT p FROM produto p JOIN p.conjuntos c WHERE c.produtoId = :id")
    List<Produto> findProdutosDoConjunto(@Param("id") Long id);

    @Query("SELECT p FROM produto p JOIN p.conjuntos c WHERE c.produtoId = :id")
    List<Produto> findConjuntosQueProdutoFazParte(@Param("id") Long id);

    @Query("SELECT p FROM produto p WHERE p.produtoId = :id AND p.status = true")
    Optional<Produto> findByIdAndStatusIsTrue(Long id);

    @Query("SELECT p FROM produto p WHERE p.status = true")
    Page<Produto> findAllProdutoByStatusIsTrue(Pageable pageable);
}
