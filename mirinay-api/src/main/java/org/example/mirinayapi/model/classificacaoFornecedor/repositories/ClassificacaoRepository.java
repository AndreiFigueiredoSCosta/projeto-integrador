package org.example.mirinayapi.model.classificacaoFornecedor.repositories;

import org.example.mirinayapi.model.classificacaoFornecedor.ClassificacaoFornecedor;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassificacaoRepository extends JpaRepository<ClassificacaoFornecedor, Long> {

    boolean existsByFornecedorAndItemRequisicaoAndClassificacaoEquals(Fornecedor fornecedor, ItemRequisicao itemRequisicao, int classificacao);

}
