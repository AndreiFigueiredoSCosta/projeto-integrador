package org.example.mirinayapi.service;


import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.marca.DTO.MarcaDTO;
import org.example.mirinayapi.model.marca.Marca;
import org.example.mirinayapi.model.unidade.Unidade;
import org.example.mirinayapi.model.unidade.dto.CadastroUnidadeDTO;
import org.example.mirinayapi.model.unidade.dto.EditarUnidadeDTO;
import org.example.mirinayapi.model.unidade.dto.UnidadeDTO;
import org.example.mirinayapi.model.unidade.repositories.UnidadeRepositories;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UnidadeService {

    private final UnidadeRepositories repositories;

    public ResponseEntity<?> getUnidade(Long id) {
        return ResponseEntity.ok(repositories.findById(id));
    }

    public Page<UnidadeDTO> getAllUnidades(Pageable pageable) {
        Page<Unidade> unidades =  repositories.findAllWithStatusTrue(pageable);

        List<UnidadeDTO> unidadeDTOS = unidades.stream().map(marca -> {
            return new UnidadeDTO(
                    marca.getUnidadeId(),
                    marca.getNome(),
                    marca.getSigla()
            );
        }).toList();
        return new PageImpl<>(unidadeDTOS, pageable, unidades.getTotalElements());
    }

    public ResponseEntity<?> deleteUnidade(Long id) {
        Optional<Unidade> unidade = repositories.findByIdAndStatusIsTrue(id);

        if (unidade.isEmpty()) {
            return ResponseEntity.badRequest().body("Unidade não encontrada");
        }

        unidade.get().setStatus(false);

        repositories.save(unidade.get());
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> saveUnidade(CadastroUnidadeDTO cadastroDTO) {
        List<Unidade> uns = this.repositories.findUnidadeBySiglaOrNome(cadastroDTO.sigla(), cadastroDTO.nome());

        if (!uns.isEmpty()) {
            return ResponseEntity.badRequest().body("Unidade já cadastrada");
        }

        Unidade unidade = Unidade.builder()
                .nome(cadastroDTO.nome())
                .sigla(cadastroDTO.sigla())
                .status(true)
                .build();

        return ResponseEntity.ok(repositories.save(unidade));
    }

    public ResponseEntity<?> updateUnidade(EditarUnidadeDTO editarUnidadeDTO) {
        Unidade unidade = repositories.findById(editarUnidadeDTO.id()).orElseThrow(() -> new RuntimeException("Unidade não encontrada"));

        List<Unidade> uns = this.repositories.findUnidadeBySiglaOrNome(editarUnidadeDTO.sigla(), editarUnidadeDTO.nome());

        for (Unidade u : uns) {
            if (!Objects.equals(u.getUnidadeId(), editarUnidadeDTO.id())) {
                return ResponseEntity.badRequest().body("Unidade já cadastrada");
            }
        }

        unidade.setNome(editarUnidadeDTO.nome());
        unidade.setSigla(editarUnidadeDTO.sigla());

    return ResponseEntity.ok(repositories.save(unidade));
    }

    public List<ResponseEntity<SelectDTO>> getUnidadeBySigla(String sigla) {
        List<Unidade> unidade = repositories.findUnidadeBySiglaLike(sigla);

        return unidade.stream().map(
                u -> ResponseEntity.ok(
                        new SelectDTO(u.getUnidadeId(), u.getNome()))
        ).collect(Collectors.toList()
        );
    }

    public List<SelectDTO> getUnidadeSelect(String label) {
        List<Unidade> unidade = repositories.findUnidadeByNomeLikeOrSiglaLike(label.toLowerCase());

        return unidade.stream().map(
                u -> (
                        new SelectDTO(u.getUnidadeId(), "("+u.getSigla()+") "+u.getNome()))
        ).toList();
    }

    public Unidade assertUnidade(Long unidadeId) throws BadRequestException {
        return repositories.findByIdAndStatusIsTrue(unidadeId).orElseThrow(() -> new BadRequestException("Unidade não encontrada"));
    }
}
