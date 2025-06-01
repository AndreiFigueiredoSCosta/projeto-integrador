package org.example.mirinayapi.model.fabricante.repositories;

import org.example.mirinayapi.model.fabricante.Fabricante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FabricanteRepository extends JpaRepository<Fabricante, Long> {
    Optional<Fabricante> findById(Long id);

    @Override
    List<Fabricante> findAll();
}
