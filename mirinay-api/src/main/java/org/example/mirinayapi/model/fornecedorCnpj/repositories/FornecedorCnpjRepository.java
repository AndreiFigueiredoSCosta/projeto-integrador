package org.example.mirinayapi.model.fornecedorCnpj.repositories;

import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface FornecedorCnpjRepository extends JpaRepository<FornecedorCnpj, Long> {

    @Query(value = "SELECT f FROM fornecedor_cnpj f INNER JOIN f.fornecedor g WHERE f.fornecedor.fornecedorId  = :id  and g.status = true and f.status = true")
    List<FornecedorCnpj> findAllFornecedoresFiliais(@Param("id") Long id);

    @Query(value = "SELECT fornecedor_cnpj.* " +
            "FROM fornecedor_cnpj " +
            "JOIN fornecedor " +
            "ON fornecedor_cnpj.fornecedor_id = fornecedor.fornecedor_id " +
            "WHERE fornecedor_cnpj.fornecedor_id = :fornecedorId" +
            " AND fornecedor_cnpj.tipo = 'MATRIZ' AND fornecedor.status = true AND fornecedor_cnpj.status = true ", nativeQuery = true)
    FornecedorCnpj findFornecedorMatriz(@Param("fornecedorId") Long fornecedorId);

    @Query(value = "SELECT * FROM fornecedor_cnpj fc WHERE fc.fornecedor_cnpj_id = :fornecedorCnpjId AND fc.status = true", nativeQuery = true)
    FornecedorCnpj getReferenceByIdAndStatusIsTrue(Long fornecedorCnpjId);

    @Query(value = "SELECT * FROM fornecedor_cnpj fc WHERE fc.fornecedor_cnpj_id = :fornecedorCnpjId AND fc.status = true", nativeQuery = true)
    Optional<FornecedorCnpj> findByIdAndStatusIsTrue(Long fornecedorCnpjId);

    @Query(value = """
        SELECT fc FROM fornecedor_cnpj fc 
                 WHERE fc.fornecedor.fornecedorId = :fornecedorId AND fc.status = true AND fc.fornecedor.status = true
        """)
    List<FornecedorCnpj> findAllByFornecedorIdAndStatusIsTrue(Long fornecedorId);

    @Query(value = """
        SELECT fc FROM fornecedor_cnpj fc 
                 WHERE fc.fornecedor.fornecedorId = :fornecedorId AND fc.status = true AND fc.fornecedor.status = true
                 AND LOWER(fc.cnpj) LIKE %:cnpj%
        """)
    List<FornecedorCnpj> searchByFornecedorIdAndCnpj(Long fornecedorId, String cnpj);

    @Query(value = "SELECT fc FROM fornecedor_cnpj fc INNER JOIN Cotacao c ON c.fornecedorCnpj.fornecedorCnpjId = fc.fornecedorCnpjId WHERE fc.fornecedorCnpjId = :fornecedorCnpjId AND c.estadoCotacao = :estadoCotacao")
    List<FornecedorCnpj> findAllByFornecedorCnpjIdAndCotacaoAndEstado(@Param("fornecedorCnpjId") Long fornecedorCnpjId, @Param("estadoCotacao") String estadoCotacao);

    @Query(value = "SELECT fc FROM fornecedor_cnpj fc INNER JOIN Cotacao c ON c.fornecedorCnpj.fornecedorCnpjId = fc.fornecedorCnpjId")
    Page<FornecedorCnpj> findAllByFornecedorCnpjIdAndCotacao( Pageable pageable);

}
