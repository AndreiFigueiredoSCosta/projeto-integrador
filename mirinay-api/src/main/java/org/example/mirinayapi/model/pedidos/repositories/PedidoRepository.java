package org.example.mirinayapi.model.pedidos.repositories;

import org.example.mirinayapi.model.enums.pedido.StatusPedidoEnum;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("SELECT p FROM Pedido p WHERE p.status IN :status")
    Page<Pedido> findByStatusIn(@Param("status") List<StatusPedidoEnum> status, Pageable pageable);

    @Query("SELECT p FROM Pedido p WHERE p.fornecedorCnpj.nome LIKE LOWER(CONCAT('%', :nome ,'%') )  AND p.status = :status")
    Page<Pedido> findAllByFornecedorCnpj_NomeLikeAndStatus(Pageable pageable, @Param("nome") String nome, StatusPedidoEnum status);


}
