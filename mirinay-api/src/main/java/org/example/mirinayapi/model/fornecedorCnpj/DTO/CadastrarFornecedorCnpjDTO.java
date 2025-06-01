package org.example.mirinayapi.model.fornecedorCnpj.DTO;

import org.example.mirinayapi.model.enums.FornecedorEnum;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.fornecedor.Fornecedor;

public record CadastrarFornecedorCnpjDTO(
        String nome,
        FornecedorEnum tipo,
        String cnpj,
        String estado,
        String cidade,
        String telefone,
        String email,
        Long fornecedorId
) {

    public FornecedorCnpj tranformaDtoEmFornecedor (Fornecedor fornecedor) {
        FornecedorCnpj fornecedorCnpj = new FornecedorCnpj();

        fornecedorCnpj.setNome(nome);
        fornecedorCnpj.setTipo(tipo);
        fornecedorCnpj.setCnpj(cnpj);
        fornecedorCnpj.setTelefone(telefone);
        fornecedorCnpj.setEmail(email);
        fornecedorCnpj.setEstado(estado);
        fornecedorCnpj.setCidade(cidade);
        fornecedorCnpj.setStatus(true);
        fornecedorCnpj.setFornecedor(fornecedor);

        return fornecedorCnpj;
    }
}
