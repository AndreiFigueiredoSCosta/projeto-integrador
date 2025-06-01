package org.example.mirinayapi.model.transportador.repositories;

import org.example.mirinayapi.model.transportador.Transportador;
import org.example.mirinayapi.model.transportador.dto.ResponseTransportador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TransportadorRepository extends JpaRepository<Transportador, Long> {

    Page<ResponseTransportador> findAllBy(Pageable pageable);

    @Query("SELECT t FROM Transportador t WHERE LOWER(t.nome) LIKE %:nome% AND t.status = true")
    List<Transportador> findByNome(@Param("nome") String nome);

    @Query("SELECT t FROM Transportador t WHERE t.transportadorId = :idTransportador AND t.status = true")
    Optional<Transportador> findByIdAndStatusIsTrue(Long idTransportador);

    @Query("SELECT t FROM Transportador t WHERE t.status = true")
    Page<Transportador> findTransportadoresWithStatusTrue(Pageable pageable);
}
