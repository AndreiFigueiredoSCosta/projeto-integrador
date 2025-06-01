package org.example.mirinayapi.model.marca.repositories;

import jakarta.validation.constraints.NotBlank;
import org.example.mirinayapi.model.marca.Marca;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MarcaRepository extends JpaRepository<Marca, Long> {

    Marca getById(Long id);
    Optional<Marca> findById(Long id);
    List<Marca> findAll();

    Optional<Marca> findByNome(@NotBlank String nome);

    @Query("SELECT m FROM marca m WHERE m.status = true")
    Page<Marca> findAllWithStatusTrue(Pageable pageable);

    @Query("SELECT m FROM marca m WHERE m.id = :id AND m.status = true")
    Optional<Marca> findMarcaByIdAndStatusIsTrue(Long id);

    @Query("SELECT m FROM marca m WHERE m.nome LIKE %:label%")
    List<Marca> findMarcaByNomeLike(String label);
}
