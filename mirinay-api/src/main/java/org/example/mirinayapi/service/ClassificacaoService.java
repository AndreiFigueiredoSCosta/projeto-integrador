package org.example.mirinayapi.service;


import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.classificacaoFornecedor.ClassificacaoFornecedor;
import org.example.mirinayapi.model.classificacaoFornecedor.dto.ClassificacaoDTO;
import org.example.mirinayapi.model.classificacaoFornecedor.repositories.ClassificacaoRepository;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.fornecedor.repositories.FornecedorRepository;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.itemRequisicao.repositories.ItemRequisicaoRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClassificacaoService {

    private final ClassificacaoRepository classificacaoRepository;
    private final FornecedorRepository fornecedorRepository;
    private final CotacaoRepository cotacaoRepository;
    private final ItemRequisicaoRepository itemRequisicaoRepository;

    public ClassificacaoFornecedor classificarFornecedor(ClassificacaoDTO classificacaoDTO) {

        Fornecedor fornecedor = fornecedorRepository.findById(classificacaoDTO.fornecedorId())
                .orElseThrow(() -> new IllegalArgumentException("Fornecedor não encontrado"));

        ItemRequisicao itemRequisicao = itemRequisicaoRepository.findById(classificacaoDTO.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado"));

       if (classificacaoRepository.existsByFornecedorAndItemRequisicaoAndClassificacaoEquals(fornecedor, itemRequisicao, classificacaoDTO.valorClassificacao())) {
            throw new IllegalArgumentException("Fornecedor já classificado com essa classificação");
        }
        switch (classificacaoDTO.valorClassificacao()) {
            case -1 -> {
                if (classificacaoDTO.motivo() == null || classificacaoDTO.motivo().isEmpty()) {
                    throw new IllegalArgumentException("Motivo da classificação não pode ser vazio");
                }
                ClassificacaoFornecedor classificacaoFornecedor = ClassificacaoFornecedor.builder()
                        .classificacao(classificacaoDTO.valorClassificacao())
                        .motivo(classificacaoDTO.motivo())
                        .fornecedor(fornecedor)
                        .build();
                return classificacaoRepository.save(classificacaoFornecedor);
            }
            case 0 -> {
                ClassificacaoFornecedor classificacaoFornecedor = ClassificacaoFornecedor.builder()
                        .classificacao(0)
                        .motivo(null)
                        .fornecedor(fornecedor)
                        .build();
                return classificacaoRepository.save(classificacaoFornecedor);
            }
            case 1 -> {
                ClassificacaoFornecedor classificacaoFornecedor = ClassificacaoFornecedor.builder()
                        .classificacao(classificacaoDTO.valorClassificacao())
                        .motivo(null)
                        .fornecedor(fornecedor)
                        .build();
                return classificacaoRepository.save(classificacaoFornecedor);
            }
            default -> throw new IllegalArgumentException("Classificação deve ser de -1 a 1");

        }

    }
}
