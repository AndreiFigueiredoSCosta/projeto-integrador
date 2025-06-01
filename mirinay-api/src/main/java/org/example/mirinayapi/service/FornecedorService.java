package org.example.mirinayapi.service;

import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.fornecedorCnpj.DTO.DetalhesFornecedorDTO;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.fornecedor.DTO.*;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.fornecedor.repositories.FornecedorRepository;
import org.example.mirinayapi.model.fornecedorCnpj.repositories.FornecedorCnpjRepository;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class FornecedorService {

    private final FornecedorRepository repository;
    private final FornecedorCnpjRepository fornecedorCnpjRepository;
    public FornecedorService(FornecedorRepository repository, FornecedorCnpjRepository fornecedorCnpjRepository) {
        this.repository = repository;
        this.fornecedorCnpjRepository = fornecedorCnpjRepository;
    }

    public void cadastrarFornecedor(CadastrarFornecedorDTO grupoFornecedor) {
        Fornecedor fornecedorBanco = Fornecedor.builder()
                .nome(grupoFornecedor.nome())
                .status(true)
                .build();
        repository.save(fornecedorBanco);
    }

    public void editarFornecedor(EditarFornecedorDTO grupoFornecedor) {
        Fornecedor fornecedorBanco = this.repository.getReferenceByIdAndStatusIsTrue(grupoFornecedor.id());

        fornecedorBanco.setNome(grupoFornecedor.nome());

        this.repository.save(fornecedorBanco);
    }

    public void deletarFornecedor(Long id) {
        Fornecedor fornecedor = this.repository.getReferenceByIdAndStatusIsTrue(id);
        if (fornecedor == null) {
            throw new IllegalArgumentException("Fornecedor com ID " + id + " não encontrado");
        }

        fornecedor.setStatus(false);
        this.repository.save(fornecedor);
    }

    public Page<ListagemFornecedorDTO> listarFornecedores(Pageable pageable) {
        Page<Fornecedor> gruposFornecedores = this.repository.findAllFornecedor(pageable);
        return ListagemFornecedorDTO.tranformaGrupoFornecedorEmDto(pageable, gruposFornecedores);
    }
    public Page<SimplesFornecedor> listarFornecedoresSimples(Pageable pageable) {
        Page<Fornecedor> gruposFornecedores = this.repository.findAllFornecedor(pageable);
        return SimplesFornecedor.tranformaGrupoFornecedorEmDto(pageable, gruposFornecedores);
    }

    public List<DetalhesFornecedorDTO> listarGrupoFornecedor (Long id) {
        List<FornecedorCnpj> grupoFornecedores = this.fornecedorCnpjRepository.findAllFornecedoresFiliais(id);
        return DetalhesFornecedorDTO.transformaFornecedorEmDto(grupoFornecedores);
    }

    public List<SelectDTO> listarFornecedoresPorNome(String label) {

//        String cnpjPattern = "\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}";
//        boolean isCnpj = Pattern.matches(cnpjPattern, label);

        List<Fornecedor> gruposFornecedores;

//        if (isCnpj) {
//            // Implementação se o label for um CNPJ
//            gruposFornecedores = this.repository.findByCnpj(label);
//        } else {
//            // Implementação se o label for um nome
            gruposFornecedores = this.repository.findByNomeContaining(label);
//        }

        return gruposFornecedores.stream().map(grupoFornecedor -> {
            return new SelectDTO(
                    grupoFornecedor.getFornecedorId(),
                    grupoFornecedor.getNome()
            );
        }).toList();
    }

    public SimplesFornecedor buscarFornecedor(Long id) {
        Fornecedor fornecedor = this.repository.getReferenceByIdAndStatusIsTrue(id);
        return new SimplesFornecedor(fornecedor.getFornecedorId(), fornecedor.getNome());
    }

    public Fornecedor assertFornecedor(Long fornecedorId) throws BadRequestException {
        return this.repository.findByIdAndStatusIsTrue(fornecedorId).orElseThrow(() -> new BadRequestException("Fornecedor não encontrado"));
    }
}
