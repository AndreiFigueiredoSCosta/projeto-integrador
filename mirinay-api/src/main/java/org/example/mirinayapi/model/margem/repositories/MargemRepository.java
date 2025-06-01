package org.example.mirinayapi.model.margem.repositories;

import org.example.mirinayapi.model.margem.DTO.MargemDTO;
import org.example.mirinayapi.model.margem.Margem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MargemRepository extends JpaRepository<Margem, Long> {
    Optional<Margem> findById(Long id);
    List<Margem> findAll();
}
