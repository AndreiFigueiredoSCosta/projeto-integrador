package org.example.mirinayapi.model.permissao.repository;

import org.example.mirinayapi.model.permissao.Autorizacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AutorizacaoRepository extends JpaRepository<Autorizacao, Long> {

    List<Autorizacao> findAllById(Long id);
}
