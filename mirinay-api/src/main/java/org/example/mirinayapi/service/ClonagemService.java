package org.example.mirinayapi.service;

import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.clonagem.DTO.*;
import org.example.mirinayapi.model.clonagem.repositories.ClonagemRepository;
import org.example.mirinayapi.model.produtoFornecedor.repositories.ProdutoFornecedorRepository;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.utils.IdConverter;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ClonagemService {

    private final ClonagemRepository repository;
    private final ProdutoFornecedorRepository produtoFornecedorRepository;
    public Clonagem create(CadastrarClonagemDTO clonagem) {
        repository.findClonagemByNome(clonagem.nome()).ifPresent(clonagem1 -> {
            throw new IllegalArgumentException("Clonagem já cadastrada");
        });

        Clonagem clonagem1 = Clonagem.builder()
                .nome(clonagem.nome())
                .status(true)
                .build();
        repository.save(clonagem1);
        return clonagem1;
    }

    public List<ListaClonagemDTO> findAll(Pageable pageable) {
        Page<Clonagem> clonagem = repository.findAll(pageable);
        if (clonagem.isEmpty()) {
            return List.of();
        }
        return clonagem.stream().map(clonagem1 -> {
            if (clonagem1.getProdutoFornecedor() == null) {
                return null;
            }
            return new ListaClonagemDTO(
                    clonagem1.getClonagemId(),
                    clonagem1.getNome(),
                    clonagem1.getStatus()
            );
        }).toList();
    }

    public DetalhesClonagemDTO findById(Long id) {
        Clonagem clonagem = repository.findById(id).orElse(null);
        assert clonagem != null;

        return DetalhesClonagemDTO.builder()
                .clonagemId(clonagem.getClonagemId())
                .nome(clonagem.getNome())
                .status(clonagem.getStatus())
                .build();
    }

    public Clonagem update(Long id, CadastrarClonagemDTO clonagem) {
        repository.findClonagemByNome(clonagem.nome()).ifPresent(clonagem1 -> {
            throw new IllegalArgumentException("Clonagem já cadastrada");
        });

        Clonagem clonagem1 = Clonagem.builder()
                .clonagemId(id)
                .nome(clonagem.nome())
                .status(true)
                .build();

        return repository.save(clonagem1);
    }

    public void delete(Long id) {
        repository.findById(id).ifPresent(clonagem -> {
            clonagem.setStatus(false);
            repository.save(clonagem);
        });
    }

    public List<ListaClonagemDTO> findClonagemByProduto(String label) {

        boolean isId = label.chars().allMatch(Character::isDigit);

        List<Clonagem> clonagem = isId ? repository.findByProdutoNameOrId(String.valueOf(Long.parseLong(label))) : repository.findByProdutoNameOrId(label);
        if (clonagem.isEmpty()) {
            return List.of();
        }

        return clonagemToDTO(clonagem);
    }
    public List<ListaClonagemDTO> findClonagemBySimilar(String label) {

        boolean isId = label.chars().allMatch(Character::isDigit);

        List<Clonagem> clonagem = isId ? repository.findBySimilarNameOrId(String.valueOf(Long.parseLong(label))) : repository.findByProdutoNameOrId(label);
        if (clonagem.isEmpty()) {
            return List.of();
        }

       return clonagemToDTO(clonagem);
    }

    public List<ListaClonagemDTO> findClonagemByFornecedor(String label) {

        boolean isId = label.chars().allMatch(Character::isDigit);

        List<Clonagem> clonagem = isId ? repository.findByFornecedorNameOrId(String.valueOf(Long.parseLong(label))) : repository.findByFornecedorNameOrId(label);
        if (clonagem.isEmpty()) {
            return List.of();
        }

        return clonagemToDTO(clonagem);
    }
    public List<SelectDTO> findClonagemByNomeOrCodigo(String label) {
        List<Clonagem> clonagem = repository.findByNomeOrCodigo(label);

        if (clonagem.isEmpty()) {
            return List.of();
        }
        return clonagem.stream().map(clonagem1 -> new SelectDTO(
                clonagem1.getClonagemId(),
                IdConverter.convert(clonagem1.getClonagemId()) + " - " +clonagem1.getNome())).toList();

    }

    public List<ListaClonagemDTO> findClonagemBySimilarId(Long label) {
        List<Clonagem> clonagem = repository.findCLonagemBySimilarId(label);

        if (clonagem.isEmpty()) {
            return List.of();
        }

        return clonagemToDTO(clonagem);
    }

    public List<ListaClonagemDTO> clonagemToDTO(List<Clonagem> clonagem) {
        return clonagem.stream().map(clonagem1 -> {
            if (clonagem1.getProdutoFornecedor() == null) {
                return null;
            }
            return new ListaClonagemDTO(
                    clonagem1.getClonagemId(),
                    clonagem1.getNome(),
                    clonagem1.getStatus()
            );
        }).toList();
    }

    public List<Long> findAllSimilares(Long clonagemId) {
        List<Similar> similares = produtoFornecedorRepository.findAllSimilares(clonagemId);

        return similares.stream().map(Similar::getSimilarId).toList();
    }

    public Clonagem assertClonagem(Long clonagemId) throws BadRequestException {
        return repository.findByIdAndStatusIsTrue(clonagemId).orElseThrow(() -> new BadRequestException("Clonagem não encontrada"));
    }
}
