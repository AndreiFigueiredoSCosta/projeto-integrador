package org.example.mirinayapi.model.cliente.repositories;


import org.example.mirinayapi.model.cliente.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;


public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Page<Cliente> findByClienteId(Long clienteId, Pageable pageable);

    Page<Cliente> findByNomeCompletoContainingIgnoreCase(String nome, Pageable pageable);

    Page<Cliente> findByCpfContainingIgnoreCase(String cpf, Pageable pageable);

    public Cliente findClienteByClienteId(Long clienteId);

}
