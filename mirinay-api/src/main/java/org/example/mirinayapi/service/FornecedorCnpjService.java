package org.example.mirinayapi.service;

import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.enums.FornecedorEnum;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.fornecedor.repositories.FornecedorRepository;
import org.example.mirinayapi.model.fornecedorCnpj.DTO.CadastrarFornecedorCnpjDTO;
import org.example.mirinayapi.model.fornecedorCnpj.DTO.EditarFornecedorCnpjDTO;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.fornecedorCnpj.repositories.FornecedorCnpjRepository;
import org.example.mirinayapi.utils.SelectDTO;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FornecedorCnpjService {

    private final FornecedorCnpjRepository repository;
    private final FornecedorRepository fornecedorRepository;
    private final FornecedorService fornecedorService;

    public FornecedorCnpjService(FornecedorCnpjRepository repository, FornecedorRepository fornecedorRepository, @Lazy FornecedorService fornecedorService) {
        this.repository = repository;
        this.fornecedorRepository = fornecedorRepository;
        this.fornecedorService = fornecedorService;
    }

    public FornecedorCnpj getCNPJbyId(Long cnpjId) {
        return this.repository.getReferenceByIdAndStatusIsTrue(cnpjId);
    }


    public void cadastrarFornecedor(CadastrarFornecedorCnpjDTO fornecedor) {
        Optional<Fornecedor> fornecedorEntity = fornecedorRepository.findByIdAndStatusIsTrue(fornecedor.fornecedorId());

        if (fornecedorEntity.isEmpty()) {
            throw new IllegalArgumentException("Fornecedor com ID " + fornecedor.fornecedorId() + " não encontrado");
        }

        if (fornecedor.tipo() == FornecedorEnum.MATRIZ) {
            FornecedorCnpj fornecedorCnpjAntigoMatriz = this.repository.findFornecedorMatriz(fornecedorEntity.get().getFornecedorId());

            if (fornecedorCnpjAntigoMatriz != null) {
                fornecedorCnpjAntigoMatriz.setTipo(FornecedorEnum.FILIAL);
                this.repository.save(fornecedorCnpjAntigoMatriz);
            }
        }

        // Transformar DTO em entidade e associar o fornecedor persistido
        FornecedorCnpj novoFornecedorCnpj = fornecedor.tranformaDtoEmFornecedor(fornecedorEntity.get());
        this.repository.save(novoFornecedorCnpj);
    }
    public void editarFornecedor (EditarFornecedorCnpjDTO fornecedor) {
        FornecedorCnpj fornecedor_Cnpj_banco = this.repository.getReferenceByIdAndStatusIsTrue(fornecedor.id());

        if (fornecedor_Cnpj_banco == null) {
            throw new IllegalArgumentException("Fornecedor com ID " + fornecedor.id() + " não encontrado");
        }

        Optional<Fornecedor> fornecedorEntity = fornecedorRepository.findByIdAndStatusIsTrue(fornecedor.fornecedorId());
        if (fornecedorEntity.isEmpty()) {
            throw new IllegalArgumentException("Fornecedor com ID " + fornecedor.fornecedorId() + " não encontrado");
        }

        fornecedor_Cnpj_banco.setNome(fornecedor.nome());
        fornecedor_Cnpj_banco.setTipo(fornecedor.tipo());
        fornecedor_Cnpj_banco.setEmail(fornecedor.email());
        fornecedor_Cnpj_banco.setCnpj(fornecedor.cnpj());
        fornecedor_Cnpj_banco.setTelefone(fornecedor.telefone());
        fornecedor_Cnpj_banco.setEstado(fornecedor.estado());
        fornecedor_Cnpj_banco.setCidade(fornecedor.cidade());

        this.repository.save(fornecedor_Cnpj_banco);
    }


    public void deletarFornecedor(Long codigo){
        FornecedorCnpj fornecedorCnpj = this.repository.getReferenceByIdAndStatusIsTrue(codigo);
            if (fornecedorCnpj.getStatus()) {

                fornecedorCnpj.setStatus(false);
                this.repository.save(fornecedorCnpj);
            }

    }

    public void tornarMatriz (Long codigo) {
        Optional<FornecedorCnpj> fornecedorCnpjNovoMatriz = this.repository.findByIdAndStatusIsTrue(codigo);

        fornecedorCnpjNovoMatriz.orElseThrow(() -> new IllegalArgumentException("Fornecedor com ID " + codigo + " não encontrado"));

        FornecedorCnpj fornecedorMatriz = fornecedorCnpjNovoMatriz.get();

        FornecedorCnpj fornecedorCnpjAntigoMatriz = this.repository.findFornecedorMatriz(fornecedorMatriz.getFornecedor().getFornecedorId());

        if (fornecedorCnpjAntigoMatriz != null) {
            if (fornecedorMatriz.getTipo() == FornecedorEnum.FILIAL) {
                fornecedorCnpjAntigoMatriz.setTipo(FornecedorEnum.FILIAL);
                this.repository.save(fornecedorCnpjAntigoMatriz);

                fornecedorMatriz.setTipo(FornecedorEnum.MATRIZ);
                this.repository.save(fornecedorMatriz);
            }
        } else {
            fornecedorMatriz.setTipo(FornecedorEnum.MATRIZ);
            this.repository.save(fornecedorMatriz);
        }
    }

    public List<Long> getCNPJIdFromFornecedor(Long fornecedorId) {
        List<FornecedorCnpj> cnpjs = this.repository.findAllByFornecedorIdAndStatusIsTrue(fornecedorId);

        return cnpjs.stream().map(FornecedorCnpj::getFornecedorCnpjId).toList();
    }

    public FornecedorCnpj assertFornecedorCnpj(Long fornecedorCnpjId) throws BadRequestException {
        return this.repository.findByIdAndStatusIsTrue(fornecedorCnpjId).orElseThrow(() -> new BadRequestException("CNPJ não encontrado"));
    }

    public List<SelectDTO> getSelectCNPJsByFornecedorId(String label, Long fornecedorId) throws BadRequestException {
        List<FornecedorCnpj> cnpjs =
                this.repository.searchByFornecedorIdAndCnpj(fornecedorId, label.toLowerCase());

        return cnpjs.stream().map(cnpj -> new SelectDTO(cnpj.getFornecedorCnpjId(), cnpj.getNome())).toList();
    }
}
//    public void deletarFornecedor(Long id) {
//        FornecedorCnpj fornecedorCnpj = this.repository.getReferenceById(id);
//
//        this.enderecoService.deletarEndereco(fornecedorCnpj.getEndereco().getCodigo());
//        this.grupoFornecedorService.deletarGrupoFornecedor(fornecedorCnpj.getFornecedor().getCodigo());
//        this.repository.deleteById(fornecedorCnpj.getCodigo());
//
//        if (fornecedorCnpj.getTipo() == FornecedorEnum.MATRIZ) { // Caso o fornecedorCnpj seja um fornecedorCnpj matriz todas as filiais vão ser excluidas
//            List<FornecedorCnpj> fornecedores_deletar = this.repository.findAllFornecedoresFiliais(fornecedorCnpj.getFornecedor().getCodigo());
//
//            for (FornecedorCnpj f : fornecedores_deletar) {
//                this.enderecoService.deletarEndereco(f.getEndereco().getCodigo());
//                this.repository.deleteById(f.getCodigo());
//            }
//        }
//
//    }
