package org.example.mirinayapi.model.orcamentoSimilar.repositories;


import org.example.mirinayapi.model.orcamentoSimilar.DTO.ListagemOrcamentoSimilarDTO;
import org.example.mirinayapi.model.orcamentoSimilar.OrcamentoSimilar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface OrcamentoSimilarRepository extends JpaRepository<OrcamentoSimilar, Long> {

    public List<OrcamentoSimilar> findOrcamentoSimilarByOrcamento_OrcamentoId(Long orcamentoId);

    public Optional<OrcamentoSimilar> findOrcamentoSimilarByOrcamento_OrcamentoIdAndSimilar_SimilarId(Long orcamentoId, Long similarId);

    void deleteByOrcamentoOrcamentoIdAndSimilar_SimilarId(Long orcamentoOrcamentoId, Long similarSimilarId);

}
