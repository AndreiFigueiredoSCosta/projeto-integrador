package org.example.mirinayapi.model.grupo.repositories;

import org.example.mirinayapi.model.grupo.Grupo;
import org.example.mirinayapi.model.grupo.dto.GrupoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {

    @Query("select distinct g from Grupo g JOIN FETCH g.subgrupos s WHERE g.grupoId = :id AND s.status = true")
    Optional<Grupo> findGrupoByGrupoIdAndSubgrupos(@Param("id") Long id);


    Optional<Grupo> findGrupoByGrupoIdAndStatusIsTrue(Long id);

    @Query("SELECT g FROM Grupo g WHERE g.status = true")
    Page<Grupo> findAllGrupos(Pageable pageable);

    @Query("SELECT g FROM Grupo g WHERE g.nome LIKE %:descricao% and g.status = true")
    List<Grupo> findByNomeContaining(@Param("descricao") String descricao);

    @Query("SELECT COUNT(*) > 0 FROM Grupo g WHERE g.nome = :nome and g.status = true")
    boolean existsByNome(String nome);

    @Query("SELECT g FROM Grupo g WHERE g.nome LIKE %:label% and g.status = true")
    Page<Grupo> findAllGruposLikeNome(String label, Pageable pageable);

    @Query("SELECT g FROM Grupo g WHERE g.nome = :nome and g.status = true")
    Optional<Grupo> findGrupoByNomeAndStatusIsTrue(String nome);
}
