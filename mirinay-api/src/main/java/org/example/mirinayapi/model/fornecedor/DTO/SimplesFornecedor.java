package org.example.mirinayapi.model.fornecedor.DTO;

import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

public record SimplesFornecedor(
        Long id,
        String nome) {
    public static SimplesFornecedor transformaGrupoFornecedorEmDto(Fornecedor fornecedor) {
        return new SimplesFornecedor(
                fornecedor.getFornecedorId(),
                fornecedor.getNome()
        );
    }
    public static Page<SimplesFornecedor> tranformaGrupoFornecedorEmDto (Pageable pageable, Page<Fornecedor> gruposFornecedores) {
        List<SimplesFornecedor> grupoFornecedorDTOs = gruposFornecedores.stream()
                .map(grupoFornecedor -> {
                    return new SimplesFornecedor(
                            grupoFornecedor.getFornecedorId(),
                            grupoFornecedor.getNome()
                    );
                })
                .collect(Collectors.toList());

        return new PageImpl<>(grupoFornecedorDTOs, pageable, gruposFornecedores.getTotalElements());
    }
}
