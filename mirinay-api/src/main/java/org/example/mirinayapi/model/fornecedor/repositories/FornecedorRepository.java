package org.example.mirinayapi.model.fornecedor.repositories;

import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    @Query("SELECT g FROM fornecedor g where g.status = true")
    Page<Fornecedor> findAllFornecedor(Pageable pageable);

    @Query("SELECT g FROM fornecedor g WHERE g.nome LIKE %:nome% and g.status = true")
    List<Fornecedor> findByNomeContaining(@Param("nome") String nome);

    @Query("SELECT g FROM fornecedor g INNER JOIN g.fornecedores f where f.cnpj LIKE %:cnpj% and g.status = true")
    List<Fornecedor> findByCnpj(@Param("cnpj") String cnpj);

    @Query("SELECT FUNCTION('DATE_TRUNC', 'MONTH', cotacao.createdAt) AS mes, " +
            "MAX(cotacao.valorUnitario) AS preco, fornecedor.nome " +
            "FROM Cotacao cotacao " +
            "JOIN cotacao.fornecedorCnpj fornecedor " +
            "WHERE cotacao.itemRequisicao.similar.similarId = :produtoId " +
            "AND cotacao.createdAt >= :dataLimite " +
            "GROUP BY FUNCTION('DATE_TRUNC', 'MONTH', cotacao.createdAt), fornecedor.nome " +
            "ORDER BY FUNCTION('DATE_TRUNC', 'MONTH', cotacao.createdAt) ASC")
    List<Object[]> findPrecosUltimos6Meses(@Param("produtoId") Long produtoId, @Param("dataLimite") LocalDate dataLimite);



    @Query("SELECT fornecedor.fornecedorCnpjId, fornecedor.nome, COUNT(cotacao.cotacaoId) " +
            "FROM Cotacao cotacao " +
            "JOIN cotacao.fornecedorCnpj fornecedor " +
            "WHERE cotacao.itemRequisicao.similar.similarId = :produtoId " +
            "GROUP BY fornecedor.fornecedorCnpjId " +
            "ORDER BY COUNT(cotacao.cotacaoId) DESC")
    List<Object[]> findFornecedoresMaisCotados(@Param("produtoId") Long produtoId);

    @Query("SELECT g FROM fornecedor g " +
            " JOIN g.fornecedores f " +
            " WHERE f.fornecedor.fornecedorId = :fornecedorId")
    Fornecedor findByFornecedoresFornecedorId(@Param("fornecedorId") Long fornecedorId);

    @Query("SELECT g FROM fornecedor g where g.fornecedorId = :id and g.status = true")
    Fornecedor getReferenceByIdAndStatusIsTrue(Long id);

    @Query("SELECT g FROM fornecedor g where g.fornecedorId = :id and g.status = true")
    Optional<Fornecedor> findByIdAndStatusIsTrue(Long id);
}
