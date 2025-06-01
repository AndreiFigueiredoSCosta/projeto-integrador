package org.example.mirinayapi.model.itemRequisicao.repositories;

import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.enums.requisicao.EstagioEnum;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRequisicaoRepository extends JpaRepository<ItemRequisicao, Long> {

    @Query("SELECT i FROM item_requisicao i WHERE i.requisicao.requisicaoId = :requisicaoId AND i.status = true")
    List<ItemRequisicao> findAllByRequisicaoIdAndStatusIsTrue(Long requisicaoId);

    List<ItemRequisicao> findAllByRequisicaoRequisicaoIdAndRequisicaoEstagio(Long id, EstagioEnum estagio);

    List<ItemRequisicao> findAllByRequisicaoEstagio(EstagioEnum requisicao_estagio);

    List<ItemRequisicao> findBySimilarProdutoProdutoId(Long produtoId);

    List<ItemRequisicao> findAllByDestinoAndEstadoItemNot(DestinoEnum destino, EstadoItemEnum estado);

    @Query("SELECT COUNT(i) FROM item_requisicao i WHERE i.estadoItem = :estado")
    int contarItensPorEstado(@Param("estado") EstadoItemEnum estado);

    @Query("SELECT i FROM item_requisicao i WHERE i.itemRequisicaoId = :itemId AND i.status = true")
    ItemRequisicao getReferenceByIdAndStatusIsTrue(Long itemId);

    @Query("""
            SELECT i
            FROM item_requisicao i
            WHERE i.itemRequisicaoId = :itemId
            AND i.status = true
            """)
    Optional<ItemRequisicao> findByIdAndStatusIsTrue(Long itemId);

//    @Query("""
//        SELECT
//
//    """)
//    List<ListagemRevisaoProdutoCotacoesDTO> findAllFornecedoresClonadosFromItemId(Long itemId);
}
