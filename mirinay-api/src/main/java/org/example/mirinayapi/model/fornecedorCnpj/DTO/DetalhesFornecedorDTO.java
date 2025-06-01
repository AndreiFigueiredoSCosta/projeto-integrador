package org.example.mirinayapi.model.fornecedorCnpj.DTO;

import org.example.mirinayapi.model.enums.FornecedorEnum;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;

import java.util.List;
import java.util.stream.Collectors;

public record DetalhesFornecedorDTO(
        Long id,
        String nome,
        String cnpj,
        FornecedorEnum tipo,
        String email,
        String estado,
        String cidade,
        String telefone) {


    public static List<DetalhesFornecedorDTO> transformaFornecedorEmDto(List<FornecedorCnpj> fornecedorCnpj) {

        return fornecedorCnpj.stream()
                 .map(fornecedor1 -> new DetalhesFornecedorDTO(
                         fornecedor1.getFornecedorCnpjId(),
                         fornecedor1.getNome(),
                         fornecedor1.getCnpj(),
                         fornecedor1.getTipo(),
                        fornecedor1.getEmail(),
                        fornecedor1.getEstado(),
                        fornecedor1.getCidade(),
                         fornecedor1.getTelefone()
                 ))
                 .collect(Collectors.toList());
    }
}
