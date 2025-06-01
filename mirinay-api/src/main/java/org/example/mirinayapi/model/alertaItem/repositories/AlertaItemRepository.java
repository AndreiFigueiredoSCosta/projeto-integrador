package org.example.mirinayapi.model.alertaItem.repositories;

import org.example.mirinayapi.model.alertaItem.AlertaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AlertaItemRepository extends JpaRepository<AlertaItem, Long> {
    @Query("SELECT a FROM AlertaItem a WHERE a.itemRequisicao.itemRequisicaoId = :itemId")
    List<AlertaItem> findByItemRequisicaoId(Long itemId);
}
