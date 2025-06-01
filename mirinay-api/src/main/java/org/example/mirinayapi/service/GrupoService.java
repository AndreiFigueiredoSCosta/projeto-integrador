package org.example.mirinayapi.service;

import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.grupo.Grupo;
import org.example.mirinayapi.model.grupo.dto.*;
import org.example.mirinayapi.model.grupo.repositories.GrupoRepository;
import org.example.mirinayapi.model.subgrupo.SubGrupo;
import org.example.mirinayapi.model.subgrupo.dto.SubGrupoDTO;
import org.example.mirinayapi.model.subgrupo.repositories.SubGrupoRepository;
import org.example.mirinayapi.utils.IdConverter;
import org.example.mirinayapi.utils.NumberUtils;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GrupoService implements NumberUtils {

    private final GrupoRepository grupoRepository;
    private final SubGrupoRepository subgrupoRepository;


    public GrupoService(GrupoRepository grupoRepository, SubGrupoRepository subgrupoRepository) {
        this.grupoRepository = grupoRepository;
        this.subgrupoRepository = subgrupoRepository;

    }

    public ResponseEntity<?> cadastrarGrupo(CadastrarGrupoDTO grupoDTO) {
        try {
            if (grupoDTO.nome() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Nome do grupo não pode ser nulo");
            }
            else if (grupoDTO.nome().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Nome do grupo não pode ser vazio");
            }
            else if (grupoDTO.nome().trim().length() < 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Nome do grupo deve ter no mínimo 3 caracteres");
            }
            else if (grupoRepository.existsByNome(grupoDTO.nome().trim())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Grupo já cadastrado");
            }

            Grupo grupo = Grupo.builder()
                    .nome(grupoDTO.nome().trim())
                    .descricao(grupoDTO.descricao().trim())
                    .status(true)
                    .build();

            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body(grupoRepository.save(grupo));
        } catch (Exception e) {
            System.out.println("Erro ao cadastrar grupo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao cadastrar grupo");
        }
    }

    public Page<ListaGruposDTO> listarGrupos(Pageable pageable) {
        Page<Grupo> grupos = this.grupoRepository.findAllGrupos(pageable);
        System.out.println("Total de grupos encontrados: " + grupos.getTotalElements());


        return getListaGruposDTOS(pageable, grupos);
    }
    public Page<ListaSimplesGruposDTO> listarGruposSimples(Pageable pageable) {
        Page<Grupo> grupos = this.grupoRepository.findAllGrupos(pageable);
        System.out.println("Total de grupos encontrados: " + grupos.getTotalElements());

        List<ListaSimplesGruposDTO> listaSimplesGruposDTO = grupos.stream().map(grupo -> {
            return new ListaSimplesGruposDTO(
                    grupo.getGrupoId(),
                    grupo.getNome()
            );
        }).toList();
        return new PageImpl<>(listaSimplesGruposDTO, pageable, grupos.getTotalElements());
    }
    public GrupoDetalhesDTO buscarGrupoPorId(Long id) {


        Optional<Grupo> optionalGrupo = this.grupoRepository.findGrupoByGrupoIdAndSubgrupos(id);
        if (optionalGrupo.isEmpty()) {
            Grupo grupoSemSubgrupos = this.grupoRepository.findById(id).get();

            return new GrupoDetalhesDTO(grupoSemSubgrupos.getGrupoId(), grupoSemSubgrupos.getNome(), grupoSemSubgrupos.getDescricao(), 0);
        }
        Grupo grupo = optionalGrupo.get();

        Integer subGrupo = grupo.getSubgrupos().size();

        return new GrupoDetalhesDTO(grupo.getGrupoId(), grupo.getNome(), grupo.getDescricao(), subGrupo);
    }
    public ResponseEntity<List<SubGrupoDTO>> buscaSubgruposPorIdGrupo(Long id) {

        Optional<Grupo> optionalGrupo = this.grupoRepository.findGrupoByGrupoIdAndSubgrupos(id);
        if (optionalGrupo.isEmpty()) {
            List<SubGrupoDTO> subGrupoDTO = Collections.emptyList();
            return ResponseEntity.ok().body(subGrupoDTO);

        }
        System.out.println("Subgrupos encontrados: " + optionalGrupo.get().getSubgrupos().size());

        Grupo grupo = optionalGrupo.get();

        return ResponseEntity.ok(grupo.getSubgrupos().stream()
                .map(subGrupo -> new SubGrupoDTO(subGrupo.getSubgrupoId(), subGrupo.getNome(), subGrupo.getDescricao()))
                .collect(Collectors.toList()));
    }


    public List<SelectDTO> buscarGruposSimplesPorNome(String descricao) {

        Long id = NumberUtils.tryParse(descricao);

        if (id != null) {
            System.out.println("Id convertido: " + id);

            Grupo grupo = grupoRepository.findGrupoByGrupoIdAndStatusIsTrue(id).get();
            return List.of(new SelectDTO(
                    grupo.getGrupoId(),
                    grupo.getNome()
            ));
        }
        List<Grupo> grupos = grupoRepository.findByNomeContaining(descricao);


        return grupos.stream().map(grupo -> {
           return new SelectDTO(
                   grupo.getGrupoId(),
                   grupo.getNome()
           );
       }).toList();
    }

    public List<SelectDTO> buscarGruposSimplesSelect(String descricao) {

        Long id = NumberUtils.tryParse(descricao);

        if (id != null) {
            Optional<Grupo> grupo = grupoRepository.findGrupoByGrupoIdAndStatusIsTrue(id);

            return grupo.map(value -> List.of(new SelectDTO(
                    value.getGrupoId(),
                    IdConverter.convert(value.getGrupoId()) + " - " + value.getNome()
            ))).orElse(Collections.emptyList());

        }
        List<Grupo> grupos = grupoRepository.findByNomeContaining(descricao);


        return grupos.stream().map(grupo -> {
            return new SelectDTO(
                    grupo.getGrupoId(),
                    IdConverter.convert(grupo.getGrupoId()) + " - " + grupo.getNome()
            );
        }).toList();
    }

    private Page<ListaGruposDTO> getListaGruposDTOS(Pageable pageable, Page<Grupo> grupos) {
        List<ListaGruposDTO> listaGruposDTO = grupos.stream().map(grupo -> {
            List<SubGrupo> subgrupos = subgrupoRepository.findSubGruposByGrupoId(grupo.getGrupoId());
            return new ListaGruposDTO(
                    grupo.getGrupoId(),
                    grupo.getDescricao(),
                    subgrupos.stream()
                            .map(subgrupo -> new SubGrupoDTO(subgrupo.getSubgrupoId(), subgrupo.getNome(), subgrupo.getDescricao()))
                            .toList().toString()
            );
        }).collect(Collectors.toList());

        return new PageImpl<>(listaGruposDTO, pageable, grupos.getTotalElements());
    }

    public ResponseEntity<?> editarGrupo(EditarGrupoDTO grupoDTO) {
        Optional<Grupo> optionalGrupo = this.grupoRepository.findById(grupoDTO.grupoId());
        if (optionalGrupo.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Grupo não encontrado");
        }

        if (grupoDTO.nome() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Nome do grupo não pode ser nulo");
        }
        else if (grupoDTO.nome().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Nome do grupo não pode ser vazio");
        }
        else if (grupoDTO.nome().trim().length() < 3) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Nome do grupo deve ter no mínimo 3 caracteres");
        }

        Optional<Grupo> grupoOptional = grupoRepository.findGrupoByNomeAndStatusIsTrue(grupoDTO.nome().trim());

        if (grupoOptional.isPresent() && !Objects.equals(grupoOptional.get().getGrupoId(), grupoDTO.grupoId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Já há um grupo cadastrado com esse nome");
        }

        Grupo g = optionalGrupo.get();

        g.setNome(grupoDTO.nome().trim());
        g.setDescricao(grupoDTO.descricao().trim());

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(this.grupoRepository.save(g));
    }

    public ResponseEntity<?> excluirGrupo(Long id) {
        try {
            Optional<Grupo> optionalGrupo = this.grupoRepository.findGrupoByGrupoIdAndStatusIsTrue(id);
            if (optionalGrupo.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Grupo não encontrado");
            }
            Grupo grupo = optionalGrupo.get();
            grupo.setStatus(false);

            this.grupoRepository.save(grupo);

            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body("Grupo excluído com sucesso");
        } catch (Exception e) {
            System.out.println("Erro ao excluir grupo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao excluir grupo");
        }
    }

    public Page<ListaSimplesGruposDTO> buscarGrupos(String label, Pageable pageable) {
        Page<Grupo> grupos = this.grupoRepository.findAllGruposLikeNome(label, pageable);
        System.out.println("Total de grupos encontrados: " + grupos.getTotalElements());

        List<ListaSimplesGruposDTO> listaSimplesGruposDTO = grupos.stream().map(grupo -> {
            return new ListaSimplesGruposDTO(
                    grupo.getGrupoId(),
                    grupo.getNome()
            );
        }).toList();
        return new PageImpl<>(listaSimplesGruposDTO, pageable, grupos.getTotalElements());
    }

    public Grupo assertGrupo(Long grupoId) throws BadRequestException {
        return grupoRepository.findGrupoByGrupoIdAndStatusIsTrue(grupoId).orElseThrow(() -> new BadRequestException("Grupo não encontrado"));
    }


    //    public Page<ListaGruposDTO> buscarGruposPorNome(String alerta, Pageable pageable) {
//        Page<Grupo> grupos = grupoRepository.findByNomeContaining(alerta, pageable);
//
//        return getListaGruposDTOS(pageable, grupos);
//    }
}
