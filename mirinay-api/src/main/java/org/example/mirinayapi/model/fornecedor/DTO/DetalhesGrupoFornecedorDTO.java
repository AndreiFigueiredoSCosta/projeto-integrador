//package org.example.mirinayapi.model.fornecedor.DTO;
//
//import org.example.mirinayapi.model.fornecedorCnpj.DTO.DetalhesFornecedorDTO;
//import org.example.mirinayapi.model.fornecedor.Fornecedor;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//public record DetalhesGrupoFornecedorDTO(
//        Long codigo,
//        String nome,
//        List<DetalhesFornecedorDTO> fornecedores) {
//    public static DetalhesGrupoFornecedorDTO tranformaGrupoFornecedorEmDto(Fornecedor grupoFornecedor) {
//        return new DetalhesGrupoFornecedorDTO(
//                grupoFornecedor.getFornecedorId(),
//                grupoFornecedor.getNome(),
//                grupoFornecedor.getFornecedores().stream()
//                        .map(fornecedor -> new DetalhesFornecedorDTO(
//                                fornecedor.getFornecedorCnpjId(),
//                                fornecedor.getNome(),
//                                fornecedor.getCnpj(),
//                                fornecedor.getTipo(),
//
//                                fornecedor.getTelefone()
//                        ))
//                        .collect(Collectors.toList())
//        );
//    }
//}
