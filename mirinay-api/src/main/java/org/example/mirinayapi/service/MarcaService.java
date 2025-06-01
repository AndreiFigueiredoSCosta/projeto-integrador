package org.example.mirinayapi.service;

import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.grupo.dto.ListaSimplesGruposDTO;
import org.example.mirinayapi.model.marca.DTO.MarcaDTO;
import org.example.mirinayapi.model.marca.Marca;
import org.example.mirinayapi.model.marca.repositories.MarcaRepository;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarcaService {

    private final MarcaRepository repository;

    public MarcaService(MarcaRepository repository) {
        this.repository = repository;
    }

    public ResponseEntity<?> cadastrarMarca(Marca marca) {
        Optional<Marca> optionalMarca = repository.findByNome(marca.getNome());

        if (optionalMarca.isPresent()) {
            return ResponseEntity.badRequest().body("Marca já cadastrada");
        }
        marca.setStatus(true);
        return ResponseEntity.ok(repository.save(marca));
    }

    public Page<MarcaDTO> buscarMarcas(Pageable pageable) {
        Page<Marca> marcas =  repository.findAllWithStatusTrue(pageable);

        List<MarcaDTO> marcaDTOS = marcas.stream().map(marca -> {
            return new MarcaDTO(
                    marca.getId(),
                    marca.getNome()
            );
        }).toList();
        return new PageImpl<>(marcaDTOS, pageable, marcas.getTotalElements());
    }


    public Marca buscarMarcaPorId(Long id) {
        return repository.findById(id).get();
    }

    public ResponseEntity<?> editarMarca(Marca marca) {
        Optional<Marca> m = repository.findById(marca.getId());

        if (m.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        m.get().setNome(marca.getNome());

        return ResponseEntity.ok(repository.save(m.get()));
    }

    public ResponseEntity<?> excluirMarca(Long id) {
        Optional<Marca> marca = repository.findById(id);
        if (marca.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        marca.get().setStatus(false);
        this.repository.save(marca.get());

        return ResponseEntity.noContent().build();
    }

    public List<SelectDTO> getMarcaSelect(String label) {
        List<Marca> marcas = repository.findMarcaByNomeLike(label);

        return marcas.stream().map(marca -> new SelectDTO(marca.getId(), marca.getNome())).toList();
    }

    public Marca assertMarca(Long marcaId) throws BadRequestException {
        return repository.findMarcaByIdAndStatusIsTrue(marcaId).orElseThrow(() -> new BadRequestException("Marca não encontrada"));
    }
}
