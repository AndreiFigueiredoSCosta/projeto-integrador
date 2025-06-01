package org.example.mirinayapi.model.itemPedido.repositories;

import org.example.mirinayapi.model.enums.pedido.StatusPedidoEnum;
import org.example.mirinayapi.model.itemPedido.ItemPedido;
import org.example.mirinayapi.model.itemPedido.ItemPedidoId;
import org.example.mirinayapi.model.pedidos.DTO.ListagemItensPedidosPendentesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, ItemPedidoId> {
    List<ItemPedido> findAllByCotacao_CotacaoId(Long itemId);

    List<ItemPedido> findAllByPedidoPedidoID(Long pedidoId);

    ItemPedido findByPedidoPedidoID(Long pedidoId);

    List<ItemPedido> findAllByCotacao_FornecedorCnpjFornecedorCnpjId(Long fornecedorId);
    List<ItemPedido> findAllByPedido_FornecedorCnpjFornecedorCnpjId(Long fornecedorId);

}
