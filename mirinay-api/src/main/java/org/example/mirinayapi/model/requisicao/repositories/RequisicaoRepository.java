package org.example.mirinayapi.model.requisicao.repositories;

import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RequisicaoRepository extends JpaRepository<Requisicao, Long> {

    // 1. Trazer todas as requisições não concluídas com destino a 'VENDA'
    @Query("SELECT r FROM requisicao r WHERE r.estagio <> 'CONCLUIDO' AND r.destino = 'VENDA' AND r.status = true")
    List<Requisicao> findAllNonConcludedWithDestinoVenda();

    // 2. Trazer todas as requisições não concluídas com destino a 'ESTOQUE'
    @Query("SELECT r FROM requisicao r WHERE r.estagio <> 'CONCLUIDO' AND r.destino = 'ESTOQUE' AND r.status = true")
    List<Requisicao> findAllNonConcludedWithDestinoEstoque();

    // 3. Trazer todas as requisições não concluídas com destino a 'VENDA/ESTOQUE'
    @Query("SELECT r FROM requisicao r WHERE r.estagio <> 'CONCLUIDO' AND r.destino = 'VENDA_ESTOQUE' AND r.status = true")
    List<Requisicao> findAllNonConcludedWithDestinoVendaEstoque();




    // 1. Trazer todas as requisições não concluídas com destino a 'VENDA' ou nome específico
// 1. Trazer todas as requisições não concluídas com destino a 'VENDA' e nome específico
    @Query("SELECT r FROM requisicao r WHERE r.estagio <> 'CONCLUIDO' AND r.destino = 'VENDA' AND r.status = true AND (:nome IS NULL OR LOWER(r.nome) LIKE LOWER(CONCAT('%', :nome, '%')))")
    List<Requisicao> findAllNonConcludedWithDestinoVendaAndNome(@Param("nome") String nome);

    // 2. Trazer todas as requisições não concluídas com destino a 'ESTOQUE' e nome específico
    @Query("SELECT r FROM requisicao r WHERE r.estagio <> 'CONCLUIDO' AND r.destino = 'ESTOQUE' AND r.status = true AND (:nome IS NULL OR LOWER(r.nome) LIKE LOWER(CONCAT('%', :nome, '%')))")
    List<Requisicao> findAllNonConcludedWithDestinoEstoqueAndNome(@Param("nome") String nome);

    // 3. Trazer todas as requisições não concluídas com destino a 'VENDA/ESTOQUE' e nome específico
    @Query("SELECT r FROM requisicao r WHERE r.estagio <> 'CONCLUIDO' AND r.destino = 'VENDA_ESTOQUE' AND r.status = true AND (:nome IS NULL OR LOWER(r.nome) LIKE LOWER(CONCAT('%', :nome, '%')))")
    List<Requisicao> findAllNonConcludedWithDestinoVendaEstoqueAndNome(@Param("nome") String nome);




    // 4. Trazer uma paginação de até 10 itens das requisições concluídas
    @Query("SELECT r FROM requisicao r WHERE r.estagio = 'CONCLUIDO' AND r.status = true AND LOWER(r.nome) LIKE LOWER(CONCAT('%', :label, '%'))")
    Page<Requisicao> findAllConcludedLikeLabel(@Param("label") String label ,Pageable pageable);

    @Query("SELECT r FROM requisicao r WHERE r.estagio = 'CONCLUIDO' AND r.status = true")
    Page<Requisicao> findAllConcluded(Pageable pageable);



    @Query("SELECT r FROM requisicao r JOIN r.itensRequisicao ir WHERE ir.similar.produto.produtoId = :produtoId")
    List<Requisicao> findRequisicoesByProdutoId(@Param("produtoId") Long produtoId);

    @Query("SELECT r FROM requisicao r WHERE r.estagio IN :estagios")
    List<Requisicao> findAllByEstagios(@Param("estagios") List<EstagioEnum> estagios);

    @Query("SELECT r FROM requisicao r WHERE r.requisicaoId = :requisicaoId AND r.status = true")
    Requisicao getReferenceByIdAndStatusIsTrue(Long requisicaoId);

    @Query("SELECT r FROM requisicao r WHERE r.requisicaoId = :requisicaoId AND r.status = true")
    Optional<Requisicao> findByRequisicaoIdAndStatusIsTrue(Long requisicaoId);
}
