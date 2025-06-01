package org.example.mirinayapi.service;

import org.example.mirinayapi.model.grupo.Grupo;
import org.example.mirinayapi.model.grupo.dto.EditarGrupoDTO;
import org.example.mirinayapi.model.grupo.repositories.GrupoRepository;
import org.example.mirinayapi.model.produto.DTO.ProdutoSimplesDTO;
import org.example.mirinayapi.model.subgrupo.dto.CadastrarSubgrupoDTO;
import org.example.mirinayapi.model.subgrupo.dto.EditarSubgrupoDTO;
import org.example.mirinayapi.model.subgrupo.repositories.SubGrupoRepository;
import org.example.mirinayapi.model.subgrupo.SubGrupo;
import org.example.mirinayapi.model.subgrupo.dto.SubGrupoDTO;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubGrupoService {

    private final SubGrupoRepository subgrupoRepository;
    private final GrupoRepository grupoRepository;

    public SubGrupoService(SubGrupoRepository subgrupoRepository, GrupoRepository grupoRepository) {
        this.subgrupoRepository = subgrupoRepository;
        this.grupoRepository = grupoRepository;
    }

    public ResponseEntity<?> cadastrarSubGrupo(CadastrarSubgrupoDTO subgrupo) {
        try {
            Optional<Grupo> grupoOptional = this.grupoRepository.findGrupoByGrupoIdAndStatusIsTrue(subgrupo.grupoId());

            if (grupoOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Grupo não encontrado");
            } else if (subgrupo.nome().length() < 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Nome do Subgrupo deve ter no mínimo 3 caracteres");
            } else if (subgrupo.nome().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Nome do Subgrupo não pode ser vazio");
            }

            Optional<SubGrupo> auxSg = this.subgrupoRepository.findByNomeAndStatusIsTrue(subgrupo.nome());

            if (auxSg.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Subgrupo já cadastrado");
            }

            SubGrupo s = SubGrupo.builder()
                    .nome(subgrupo.nome())
                    .descricao(subgrupo.descricao())
                    .grupo(grupoOptional.get())
                    .status(true)
                    .build();

            System.out.println(s);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(subgrupoRepository.save(s));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao cadastrar Subgrupo");
        }

    }

    public List<SubGrupoDTO> listarSubGrupos() {
        return this.subgrupoRepository.findSubGruposByStatusIsTrue();
    }
    public List<SelectDTO> listarSubGruposSelect(String label) {
        List <SubGrupo> subGrupo = this.subgrupoRepository.findSubGruposByStatusIsTrueAndNomeLike(label);
        return subGrupo.stream().map(subGrupo1 -> {
            return new SelectDTO(subGrupo1.getSubgrupoId(), subGrupo1.getNome());

        }).toList();

    }

    public ResponseEntity<?> buscaProdutosPorSubGrupoPorId(Long id) {
        Optional<SubGrupo> sg = this.subgrupoRepository.findSubGrupoByIdAndStatusIsTrue(id);
        if (sg.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Subgrupo não encontrado");
        }

        List<ProdutoSimplesDTO> produtos =
                this.subgrupoRepository
                        .findProdutosBySubgrupoId(sg.get().getSubgrupoId())
                        .stream()
                        .map(produto -> {
                            return new ProdutoSimplesDTO(
                                produto.getProdutoId(),
                                produto.getNome()
                            );
                        }).toList();

        return ResponseEntity.status(HttpStatus.OK)
                .body(produtos);
    }
    public List<SubGrupoDTO> buscarSubGrupoPorId(Long id) {

        List<SubGrupo> subGrupos = this.subgrupoRepository.findSubById(id);
        return subGrupos.stream().map(subGrupo -> {
            return new SubGrupoDTO(
                    subGrupo.getSubgrupoId(),
                    subGrupo.getNome(),
                    subGrupo.getDescricao()
            );
        }).collect(Collectors.toList());
    }
    public ResponseEntity<?> editarGrupo(EditarSubgrupoDTO subgrupoDTO) {
        try {
            Optional<SubGrupo> subGrupoOptional = this.subgrupoRepository.findSubGrupoByIdAndStatusIsTrue(subgrupoDTO.subgrupoId());
            if (subGrupoOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Subgrupo não encontrado");
            }

            Optional<Grupo> grupoOptional = this.grupoRepository.findGrupoByGrupoIdAndStatusIsTrue(subgrupoDTO.grupoId());
            if (grupoOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Grupo não encontrado");
            } else if (subgrupoDTO.nome().length() < 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Nome do Subgrupo deve ter no mínimo 3 caracteres");
            } else if (subgrupoDTO.nome().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Nome do Subgrupo não pode ser vazio");
            }

            Optional<SubGrupo> auxSg = this.subgrupoRepository.findByNomeAndStatusIsTrue(subgrupoDTO.nome());

            if (auxSg.isPresent() && !auxSg.get().getSubgrupoId().equals(subgrupoDTO.subgrupoId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Subgrupo já cadastrado");
            }

            subGrupoOptional.ifPresent(subGrupo -> {
                subGrupo.setNome(subgrupoDTO.nome());
                subGrupo.setDescricao(subgrupoDTO.descricao());
                subGrupo.setGrupo(grupoOptional.get());
            });

            return ResponseEntity.status(HttpStatus.OK)
                    .body(subgrupoRepository.save(subGrupoOptional.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao cadastrar Subgrupo");
        }
    }

    public ResponseEntity<?> excluirSubGrupo(Long id) {
        Optional<SubGrupo> subGrupoOptional = this.subgrupoRepository.findSubGrupoByIdAndStatusIsTrue(id);
        if (subGrupoOptional.isEmpty()) {
            throw new RuntimeException("Subgrupo não encontrado");
        }
        subGrupoOptional.ifPresent(subGrupo -> {
            subGrupo.setStatus(false);
            this.subgrupoRepository.save(subGrupo);
        });

        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body("Subgrupo excluído com sucesso");
    }

    public SubGrupo assertSubGrupo(Long subgrupoId) {
        Optional<SubGrupo> subGrupo = subgrupoRepository.findSubGrupoByIdAndStatusIsTrue(subgrupoId);
        if (subGrupo.isEmpty()) {
            throw new RuntimeException("Subgrupo não encontrado");
        }

        return subGrupo.get();
    }
}
