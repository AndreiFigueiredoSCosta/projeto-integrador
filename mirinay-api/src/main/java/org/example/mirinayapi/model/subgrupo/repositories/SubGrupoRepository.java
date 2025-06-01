package org.example.mirinayapi.model.subgrupo.repositories;

import org.example.mirinayapi.model.grupo.dto.GrupoDTO;
import org.example.mirinayapi.model.produto.DTO.ProdutoSimplesDTO;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.subgrupo.SubGrupo;
import org.example.mirinayapi.model.subgrupo.dto.SGProdutosDTO;
import org.example.mirinayapi.model.subgrupo.dto.SubEProdutosDTO;
import org.example.mirinayapi.model.subgrupo.dto.SubGrupoDTO;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubGrupoRepository extends JpaRepository<SubGrupo, Long> {

    @Query("SELECT sg FROM SubGrupo sg " +
            "LEFT JOIN FETCH sg.produtos p" +
            " WHERE sg.subgrupoId = :unidadeId and sg.status = true")
    List<SubGrupo> findSubById(long unidadeId);

    @Query("SELECT sg FROM SubGrupo sg " +
            " WHERE sg.subgrupoId = :unidadeId and sg.status = true")
    Optional<SubGrupo> findSubGrupoByIdAndStatusIsTrue(@Param("unidadeId") Long unidadeId);

    @Query("""
            SELECT p
            FROM produto p
            WHERE p.subgrupo.subgrupoId = :subgrupoId and p.status = true
            """)
    List<Produto> findProdutosBySubgrupoId(@Param("subgrupoId") Long subgrupoId);

    List<SubGrupoDTO> findSubGruposByStatusIsTrue();

    @Query("SELECT sg FROM SubGrupo sg WHERE sg.status = true and sg.nome like %:nome%")
    List<SubGrupo> findSubGruposByStatusIsTrueAndNomeLike(@Param("nome") String nome);


    @Query("SELECT sg FROM SubGrupo sg WHERE sg.grupo.grupoId = :grupoId and sg.status = true")
    List<SubGrupo> findSubGruposByGrupoId(@Param("grupoId") Long grupoId);

    Optional<SubGrupo> findByNomeAndStatusIsTrue(String nome);
}
