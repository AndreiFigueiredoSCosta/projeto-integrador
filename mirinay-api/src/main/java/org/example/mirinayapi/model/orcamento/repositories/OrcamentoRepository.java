package org.example.mirinayapi.model.orcamento.repositories;


import org.example.mirinayapi.model.orcamento.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;


@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    Optional<Orcamento> findOrcamentoByOrcamentoId(Long id);

    List<Orcamento> findOrcamentoByCliente_ClienteId(Long clienteId);

    Page<Orcamento> findByOrcamentoId(Long id, Pageable pageable);

    Page<Orcamento> findByCliente_NomeCompletoContainingIgnoreCase(String nomeCompleto, Pageable pageable);

    Page<Orcamento> findByVendedor_NameContainingIgnoreCase(String name, Pageable pageable);

    List<Orcamento> findOrcamentoByVendedor_Name(String vendedorNome);

    void deleteByOrcamentoId(Long id);
}
