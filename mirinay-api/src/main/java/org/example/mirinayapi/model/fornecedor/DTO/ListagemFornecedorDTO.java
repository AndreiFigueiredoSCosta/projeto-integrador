package org.example.mirinayapi.model.fornecedor.DTO;

import org.example.mirinayapi.model.fornecedorCnpj.DTO.ListagemFornecedorGrupoFornecedorDTO;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

public record ListagemFornecedorDTO(
        Long codigo,
        String nome,
        List<ListagemFornecedorGrupoFornecedorDTO> fornecedores
) {

    public static Page<ListagemFornecedorDTO> tranformaGrupoFornecedorEmDto (Pageable pageable, Page<Fornecedor> gruposFornecedores) {
        List<ListagemFornecedorDTO> grupoFornecedorDTOs = gruposFornecedores.stream()
                .map(grupoFornecedor -> {
                    List<FornecedorCnpj> fornecedores = grupoFornecedor.getFornecedores();
                    return new ListagemFornecedorDTO(
                            grupoFornecedor.getFornecedorId(),
                            grupoFornecedor.getNome(),
                            fornecedores.stream().map(fornecedor -> {
                                return new ListagemFornecedorGrupoFornecedorDTO(
                                        fornecedor.getFornecedorCnpjId(),
                                        fornecedor.getNome(),
                                        fornecedor.getCnpj(),
                                        fornecedor.getTelefone(),
                                        fornecedor.getEndereco().getUf(),
                                        fornecedor.getEndereco().getCidade()
                                );
                            }).collect(Collectors.toList())
                    );
                })
                .collect(Collectors.toList());

        return new PageImpl<>(grupoFornecedorDTOs, pageable, gruposFornecedores.getTotalElements());
    }
}
