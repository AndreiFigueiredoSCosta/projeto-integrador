package org.example.mirinayapi.model.clonagem.repositories;

import org.example.mirinayapi.model.clonagem.Clonagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClonagemRepository extends JpaRepository<Clonagem, Long> {
    Clonagem getReferenceById(Long codigo);


    @Query("SELECT c FROM clonagem c JOIN c.produtoFornecedor pf" +
            " WHERE LOWER(pf.produto.produto.nome) LIKE LOWER(CONCAT('%', :label, '%'))" +
            " OR CAST(pf.produto.produto.produtoId AS string) = :label")
    List<Clonagem> findByProdutoNameOrId(@Param("label") String label);

    @Query("SELECT c FROM clonagem c JOIN c.produtoFornecedor pf " +
            "WHERE LOWER(pf.produto.referencia) LIKE LOWER(CONCAT('%', :label, '%')) " +
            "OR CAST(pf.produto.similarId AS string) = :label")
    List<Clonagem> findBySimilarNameOrId(@Param("label") String label);

    @Query("SELECT c FROM clonagem c JOIN c.produtoFornecedor pf" +
            " WHERE LOWER(pf.fornecedor.nome) LIKE LOWER(CONCAT('%', :label, '%'))" +
            " OR CAST( pf.fornecedor.fornecedorId AS string ) = :label")
    List<Clonagem> findByFornecedorNameOrId(@Param("label") String label);

    @Query("""
        SELECT c FROM clonagem c
        WHERE (LOWER(c.nome) LIKE LOWER(CONCAT('%', :label, '%'))
           OR CAST(c.clonagemId AS string) = :label) and c.status = true
    """)
    List<Clonagem> findByNomeOrCodigo(@Param("label") String label);

    @Query("SELECT c FROM clonagem c" +
            " JOIN c.produtoFornecedor pf " +
            " WHERE pf.produto.similarId = :similarId and c.status = true and pf.status = true")
    List<Clonagem> findCLonagemBySimilarId(@Param("similarId") Long similarId);

    @Query("SELECT c FROM clonagem c WHERE c.status = true")
    List<Clonagem> findAllWithStatusTrue();

    @Query("SELECT c FROM clonagem c WHERE c.nome = :nome and c.status = true")
    Optional<Object> findClonagemByNome(String nome);

    @Query("""
    SELECT c FROM clonagem c 
        INNER JOIN produto_clonagem pc on c.clonagemId = pc.clonagem.clonagemId
        WHERE pc.similar.similarId = :similarId and c.status = true
    """)
    List<Clonagem> findClonagensBySimilarId(Long similarId);

    @Query("""
        SELECT c FROM clonagem c
            WHERE c.clonagemId = :clonagemId AND c.status = true 
    """)
    Optional<Clonagem> findByIdAndStatusIsTrue(Long clonagemId);
}
