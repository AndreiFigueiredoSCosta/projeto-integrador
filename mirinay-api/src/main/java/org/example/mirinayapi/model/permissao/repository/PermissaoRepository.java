package org.example.mirinayapi.model.permissao.repository;

import org.example.mirinayapi.model.permissao.Permissao;
import org.example.mirinayapi.model.permissao.enums.ModuloEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {

    Optional<Permissao> findByModulo(String modulo);

    @Query("SELECT p FROM Permissao p JOIN p.autorizacoes a WHERE a.id = :idAutorizacao")
    List<Permissao> findAllByAutorizacao_Id(@Param("idAutorizacao") Long idAutorizacao);


}
