package org.example.mirinayapi.model.cotacao.repositories;

import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface CotacaoRepository extends JpaRepository<Cotacao, Long> {

    @Query("""
        SELECT c FROM Cotacao c
            WHERE c.itemRequisicao.itemRequisicaoId = :itemId
    """)
    List<Cotacao> findAllByItemRequisicaoId(Long itemId);
//    @Query("""
//        SELECT c FROM Cotacao c
//        JOIN c.itemRequisicao ir
//        JOIN c.fornecedorCnpj f
//        WHERE ir.itemRequisicaoId = :itemId
//    """)

    @Query("SELECT c FROM Cotacao c " +
            "JOIN c.itemRequisicao ir " +
            "JOIN ir.requisicao r " +
            "WHERE r.nome LIKE LOWER(CONCAT('%', :label , '%')) ")
    List<Cotacao> findAllByItemRequisicaoRequisicao(@Param("label") String label);

    List<Cotacao> findAllByItemRequisicaoRequisicaoRequisicaoId(Long id);
    List<Cotacao> findAllByItemRequisicao_ItemRequisicaoId(Long itemId);

    List<Cotacao> findAllByFornecedorCnpj_FornecedorAndItemRequisicao_ItemRequisicaoId(Fornecedor fornecedor, Long itemId);

    List<Cotacao> findAllByFornecedorCnpjAndItemRequisicaoSimilarSimilarId(FornecedorCnpj fornecedor, Long similarId);

    @Query("SELECT c.valorUnitario FROM Cotacao c WHERE c.fornecedorCnpj.fornecedorCnpjId = :fornecedorId ORDER BY c.createdAt DESC LIMIT 1")
    BigDecimal findUltimoPrecoByFornecedor(@Param("fornecedorId") Long fornecedorId);

    @Query("SELECT COUNT(c) FROM Cotacao c " +
            "WHERE c.fornecedorCnpj.fornecedorCnpjId = :fornecedorId")
    int countByFornecedor(@Param("fornecedorId") Long fornecedorId);

    @Query("""
        SELECT fc FROM fornecedor_cnpj fc
            INNER JOIN item_requisicao ir ON ir.requisicao.requisicaoId = :requisicaoId
            INNER JOIN Cotacao c ON c.itemRequisicao.itemRequisicaoId = ir.itemRequisicaoId
            WHERE c.fornecedorCnpj.fornecedorCnpjId = :fornecedorId
""")
    List<FornecedorCnpj> getCNPJs(Long requisicaoId, Long fornecedorId);

    @Query("""
        SELECT fc FROM fornecedor_cnpj fc
            INNER JOIN Cotacao c on c.fornecedorCnpj.fornecedorCnpjId = fc.fornecedorCnpjId
            WHERE c.itemRequisicao.requisicao.requisicaoId = :requisicaoId
    """)
    Optional<List<FornecedorCnpj>> findFornecedoresByRequisicaoId(Long requisicaoId);

    @Query("""
        SELECT c FROM Cotacao c 
            WHERE c.ultimaCotacao BETWEEN :dataLimite AND CURRENT_DATE 
                AND c.fornecedorCnpj.fornecedorCnpjId = :cnpjId
                AND c.itemRequisicao.similar.similarId = :similarId
            ORDER BY c.ultimaCotacao DESC 
    """)
    List<Cotacao> findCotacoesByDataLimiteAndSimilarAndCnpjId(
            @Param("similarId") Long similarId,
            @Param("cnpjId") Long cnpjId,
            @Param("dataLimite") Date dataLimite
    );


    @Query("SELECT c FROM Cotacao c WHERE c.fornecedorCnpj.fornecedorCnpjId = :fornecedorId AND c.itemRequisicao.requisicao.requisicaoId = :requisicaoId")
    List<Cotacao> findAllByFornecedorAndRequisicao(@Param("fornecedorId") Long fornecedorId, @Param("requisicaoId") Long requisicaoId);

    @Query("SELECT c FROM Cotacao c WHERE c.fornecedorCnpj.fornecedorCnpjId = :fornecedorId AND c.estadoCotacao = :estadoCotacao")
    List<Cotacao> findAllByFornecedorCnpj_FornecedorCnpjIdAndEstadoCotacao(Long fornecedorId, EstadoItemEnum estadoCotacao);

    @Query("SELECT c FROM Cotacao c WHERE c.fornecedorCnpj.fornecedorCnpjId = :fornecedorId ")
    List<Cotacao> findAllByFornecedorCnpj_FornecedorCnpjId(Long fornecedorId);
    @Query("SELECT c FROM Cotacao c WHERE c.estadoCotacao = :estadoCotacao AND c.requisicao.nome LIKE LOWER(CONCAT('%', :nome ,'%') )  ")
    Page<Cotacao> findAllByCotacaoEstadoCotacaoAndLikeName(Pageable pageable, EstadoItemEnum estadoCotacao, String nome);

    Page<Cotacao> findAllByEstadoCotacao(Pageable pageable, EstadoItemEnum estadoCotacao);

}
