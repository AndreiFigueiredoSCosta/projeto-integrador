package org.example.mirinayapi.model.fornecedorClonagem.repositories;

import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.fornecedorClonagem.FornecedorClonagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FornecedorClonagemRepository extends JpaRepository<FornecedorClonagem, Long> {

    @Query(value = """
            SELECT COUNT(*) > 0
            FROM fornecedor_clonagem fc
            WHERE fc.fornecedor_id = :fornecedorId AND fc.clonagem_id = :clonagemId
            """, nativeQuery = true)
    boolean existsByFornecedorAndClonagem(
            @Param("fornecedorId") Long fornecedorId,
            @Param("clonagemId") Long clonagemId
    );

    @Query(value = """
            SELECT f
            FROM fornecedor_clonagem fc
            JOIN fornecedor f ON fc.fornecedor_id = f.fornecedor_id
            WHERE fc.clonagem_id = :clonagemId
            """, nativeQuery = true)
    List<Fornecedor> findAllByClonagemId(
            @Param("clonagemId") Long clonagemId
    );

    @Query(value = """
            SELECT fc
            FROM fornecedor_clonagem fc
            WHERE fc.fornecedor.fornecedorId = :fornecedorId AND fc.clonagem.clonagemId = :clonagemId
            """)
    Optional<FornecedorClonagem> findByFornecedorAndClonagem(Long fornecedorId, Long clonagemId);
}
