package org.example.mirinayapi.model.transportadorCnpj.repositories;

import org.example.mirinayapi.model.transportadorCnpj.TransportadorCnpj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TransportadorFilialRepository extends JpaRepository<TransportadorCnpj, Long> {
    List<TransportadorCnpj> findTransportadorCnpjByTransportadorCnpjId(Long transportadorId);

    @Query("SELECT t FROM TransportadorCnpj t WHERE t.transportador.transportadorId = :idTransportador AND t.transportador.status = true AND t.status = true")
    List<TransportadorCnpj> findTransportadorByTransportadorIdAndStatusIsTrue(Long idTransportador);

    @Query("SELECT t FROM TransportadorCnpj t WHERE t.transportadorCnpjId = :idFilial AND t.status = true")
    Optional<TransportadorCnpj> findByIdAndStatusIsTrue(Long idFilial);
}
