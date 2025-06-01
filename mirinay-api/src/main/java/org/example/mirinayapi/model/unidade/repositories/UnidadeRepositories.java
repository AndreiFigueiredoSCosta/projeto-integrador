package org.example.mirinayapi.model.unidade.repositories;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.mirinayapi.model.marca.Marca;
import org.example.mirinayapi.model.unidade.Unidade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UnidadeRepositories extends JpaRepository<Unidade, Long> {
    Unidade findByNome(String nome);

    List<Unidade> findUnidadeBySiglaLike(String sigla);

    @Query("SELECT u FROM unidade u WHERE (LOWER(u.sigla) = LOWER(:sigla) OR LOWER(u.nome) = LOWER(:nome)) AND u.status = true")
    List<Unidade> findUnidadeBySiglaOrNome(
            @NotNull(message = "A sigla é obrigatória")
            @NotBlank(message = "A sigla não pode ser vazia")
            @Size(min = 2, max = 10, message = "A sigla deve ter entre 2 e 10 caracteres")
            @Param("sigla")
            String sigla,
            @NotNull(message = "O nome é obrigatório")
            @NotBlank(message = "O nome não pode ser vazio")
            @Size(min = 3, max = 255, message = "O nome deve ter entre 3 e 255 caracteres")
            @Param("nome")
            String nome);

    @Query("SELECT u FROM unidade u WHERE u.unidadeId = :id AND u.status = true")
    Optional<Unidade> findByIdAndStatusIsTrue(
            @Param("id") Long id);

    @Query("SELECT u FROM unidade u WHERE u.status = true")
    Page<Unidade> findAllWithStatusTrue(Pageable pageable);

    @Query("SELECT u FROM unidade u WHERE LOWER(u.sigla) LIKE LOWER(CONCAT('%', :label, '%'))")
    List<Unidade> findUnidadeByNomeLike(String label);

    @Query("SELECT u FROM unidade u WHERE u.status = true AND (LOWER(u.sigla) LIKE %:label% OR LOWER(u.nome) LIKE %:label%)")
    List<Unidade> findUnidadeByNomeLikeOrSiglaLike(String label);
}
