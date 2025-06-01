package org.example.mirinayapi.service.cotacao.estagios;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.mirinayapi.model.alertaItem.AlertaItem;
import org.example.mirinayapi.model.clonagem.Clonagem;
import org.example.mirinayapi.model.cotacao.Cotacao;
import org.example.mirinayapi.model.cotacao.DTO.revisao.ListagemRevisaoFornecedorDTO;
import org.example.mirinayapi.model.cotacao.DTO.revisao.ListagemRevisaoProdutoCotacoesDTO;
import org.example.mirinayapi.model.cotacao.DTO.revisao.RevisaoInsertCNPJDTO;
import org.example.mirinayapi.model.cotacao.repositories.CotacaoRepository;
import org.example.mirinayapi.model.enums.FornecedorEnum;
import org.example.mirinayapi.model.enums.itemRequisicao.EstadoItemEnum;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.fornecedor.Fornecedor;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;
import org.example.mirinayapi.model.itemRequisicao.DTO.EditarItemRequisicaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.InserirItemEmFaseCotacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.*;
import org.example.mirinayapi.model.misc.DeleteDTO;
import org.example.mirinayapi.model.itemRequisicao.ItemRequisicao;
import org.example.mirinayapi.model.itemRequisicao.repositories.ItemRequisicaoRepository;
import org.example.mirinayapi.model.produto.DTO.CadastroProdutoDTO;
import org.example.mirinayapi.model.produto.Produto;
import org.example.mirinayapi.model.produtoFornecedor.ProdutoFornecedor;
import org.example.mirinayapi.model.produtoFornecedor.repositories.ProdutoFornecedorRepository;
import org.example.mirinayapi.model.requisicao.Requisicao;
import org.example.mirinayapi.model.requisicao.repositories.RequisicaoRepository;
import org.example.mirinayapi.model.similar.DTO.SubmitSimilarDTO;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.service.*;
import org.example.mirinayapi.service.cotacao.utils.CotacaoUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CotacaoRevisaoService {
    private final CotacaoRepository cotacaoRepository;
    private final ItemRequisicaoService itemRequisicaoService;
    private final RequisicaoRepository requisicaoRepository;
    private final SimilarService similarService;
    private final ItemRequisicaoRepository itemRequisicaoRepository;
    private final FornecedorCnpjService fornecedorCnpjService;
    private final ProdutoFornecedorRepository produtoFornecedorRepository;
    private final CotacaoUtils cotacaoUtils;
    private final AlertaItemService alertaItemService;
    private final RequisicaoService requisicaoService;
    private final FornecedorService fornecedorService;
    private final ClonagemService clonagemService;
    private final ProdutoService produtoService;

    // ----------------------------- GET -----------------------------

    // Função para obter os fornecedores em cotação para revisão
    public List<ListagemRevisaoFornecedorDTO> getRevisaoFornecedor(Long requisicaoId) throws BadRequestException {
        Optional<Requisicao> requisicao = requisicaoRepository.findByRequisicaoIdAndStatusIsTrue(requisicaoId);
        if (requisicao.isEmpty()) {
            throw new BadRequestException("Requisição não encontrada");
        }

        Optional<List<FornecedorCnpj>> fornecedores = cotacaoRepository.findFornecedoresByRequisicaoId(requisicaoId);
        if (fornecedores.isEmpty()){
            throw new BadRequestException("Nenhum fornecedor encontrado para a requisição");
        }

        return fornecedores.get().stream().map(
                cnpj -> ListagemRevisaoFornecedorDTO.builder()
                        .cnpjId(cnpj.getFornecedorCnpjId())
                        .cnpj(cnpj.getCnpj())
                        .nomeFantasia(
                                !cnpj.getNome().isEmpty() ?
                                        cnpj.getNome()
                                        :
                                        cnpj.getFornecedor().getNome()
                        )
                        .fornecedorId(cnpj.getFornecedor().getFornecedorId())
                        .observacoes("--- EM PRODUÇÃO ---")
                        .build()
        ).toList();
    }

    // Função para obter items em cotação para revisão
    public List<ListagemItensRevisaoCotacaoDTO> getRevisaoItem(Long cotacaoId) {
        return itemRequisicaoService.cotacaoRevisaoListarItens(cotacaoId);
    }

    // Função para obter os produtos similares para um item em cotação para revisão
    public List<ListagemSimilaresRevisaoCotacaoDTO> getRevisaoItemSimilar(Long itemId) {
        return itemRequisicaoService.findSimilaresByItemId(itemId);
    }

    // Função para obter os fornecedores para um item em cotação para revisão
    public List<ListagemFornecedoresRevisaoDTO> getFornecedoresCotacao(Long requisicaoId) {
        // Buscar todos os itens da requisição
        List<ItemRequisicao> itensRequisicao = itemRequisicaoRepository.findAllByRequisicaoIdAndStatusIsTrue(requisicaoId);

        System.out.println(new ArrayList<>(itensRequisicao));

        // Obter os similares relacionados a esses itens
        List<Similar> similares = itensRequisicao.stream()
                .map(ItemRequisicao::getSimilar)
                .filter(Objects::nonNull)
                .toList();

        // Lista para armazenar os fornecedores revisados
        Set<ListagemFornecedoresRevisaoDTO> fornecedoresRevisaoList = new HashSet<>();

        // Para cada idSimilar, buscar os fornecedores e criar os DTOs
        for (Similar similar : similares) {

            // Buscar fornecedores associados ao idSimilar
            List<ProdutoFornecedor> fornecedoresProduto = produtoFornecedorRepository.findByProdutoItemRequisicaoItemRequisicaoId(similar.getSimilarId());

            // Mapear os fornecedores para DTOs
            fornecedoresProduto.stream()
                    .map(ProdutoFornecedor::getFornecedor) // Obter Fornecedor de ProdutoFornecedor
                    .distinct() // Evitar duplicatas

                    .forEach(fornecedor -> {
                        String cnpjMatriz = fornecedor.getFornecedores().stream()
                                .filter(f -> f.getTipo() == FornecedorEnum.MATRIZ)
                                .map(FornecedorCnpj::getCnpj)
                                .collect(Collectors.joining(", "));

                        // Criar DTO para o fornecedor
                        fornecedoresRevisaoList.add(new ListagemFornecedoresRevisaoDTO(
                                fornecedor.getFornecedorId(),
                                fornecedor.getNome(),
                                cnpjMatriz,
                                fornecedor.getNome()
                        ));
                    });
        }

        return new ArrayList<>(fornecedoresRevisaoList);
    }

    // Função que retorna os IDs dos CNPJs cadastrados de um fornecedor em uma requisição
    public List<Long> getRevisaoIdsCNPJs(Long requisicaoId, Long fornecedorId) {
        List<FornecedorCnpj> cnpjs = cotacaoRepository.getCNPJs(requisicaoId, fornecedorId);

        return cnpjs.stream().map(FornecedorCnpj::getFornecedorCnpjId).collect(Collectors.toList());
    }

    // Função que retorna as cotações de um item de requisição
    public List<ListagemRevisaoProdutoCotacoesDTO> getRevisaoItemCotacao(Long itemId) throws BadRequestException {
        ItemRequisicao itemRequisicao = itemRequisicaoService.assertItemRequisicao(itemId);

        List<Cotacao> cotacoes = this.cotacaoRepository.findAllByItemRequisicaoId(itemRequisicao.getItemRequisicaoId());

        return cotacoes.stream().map(
                cotacao -> {
                    String nomeFornecedor = "NÃO ENCONTRADO!";
                    String auxNome = cotacao.getFornecedorCnpj().getNome();

                    if (auxNome != null && !auxNome.isEmpty()) {
                        nomeFornecedor = auxNome;
                    }
                    else{
                        nomeFornecedor = cotacao.getFornecedorCnpj().getFornecedor().getNome();
                    }

                    return ListagemRevisaoProdutoCotacoesDTO.builder()
                            .nomeFornecedor(nomeFornecedor)
                            .cnpjId(cotacao.getFornecedorCnpj().getFornecedorCnpjId())
                            .observacoes("--- EM PRODUÇÃO ---") //TODO: Implementar observações
                            .fornecedorId(cotacao.getFornecedorCnpj().getFornecedor().getFornecedorId())
                            .cnpj(cotacao.getFornecedorCnpj().getCnpj())
                            .cotacaoId(cotacao.getCotacaoId())
                            .build();
                }
        ).collect(Collectors.toList());
    }

    // ------------------- PATCH -------------------

    // Função para selecionar/alterar um idSimilar para um item de requisição
    public ResponseEntity<?> patchRevisaoSelecionarSimilar(Long itemId, Long similarId) {
        // Validar entrada
        if (itemId == null || similarId == null) {

            return ResponseEntity.badRequest().body("Item ID e Similar ID devem ser fornecidos.");
        }

        try {
            // Buscar o item requisitado
            Optional<ItemRequisicao> ir = itemRequisicaoRepository.findByIdAndStatusIsTrue(itemId);
            if (ir.isEmpty()){
                throw new EntityNotFoundException("ItemRequisicao não encontrado com ID: " + itemId);
            }

            ItemRequisicao itemRequisicao = ir.get();

            // Buscar o idSimilar
            Similar similar = similarService.findSimilarById(similarId);

            // Atualizar informações do item
            itemRequisicao.setSimilar(similar);
            itemRequisicao.setReferencia(similar.getReferencia());

            // Salvar as alterações no item
            itemRequisicaoRepository.save(itemRequisicao);

            // Excluir as cotações antigas associadas a este item
            List<Cotacao> cotacoesAntigas = cotacaoRepository.findAllByItemRequisicaoId(itemId);
            cotacaoRepository.deleteAll(cotacoesAntigas);

            // Criar as novas cotações com base no novo idSimilar
            this.itemRequisicaoService.createInitialCotacao(itemRequisicao);

            // Resposta de sucesso
            return ResponseEntity.ok("Similar selecionado e cotações recriadas com sucesso.");
        } catch (EntityNotFoundException e) {
            // Erro caso o item ou idSimilar não sejam encontrados
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            // Erro genérico
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar item e recriar cotações.");
        }
    }

    public ResponseEntity<?> patchRevisaoCotacaoAlterarCNPJ(Long cotacaoId, Long cnpjId) throws BadRequestException {
        Cotacao cotacao = cotacaoUtils.assertCotacao(cotacaoId);
        FornecedorCnpj fornecedorCnpj = fornecedorCnpjService.assertFornecedorCnpj(cnpjId);

        cotacao.setFornecedorCnpj(fornecedorCnpj);
        cotacaoRepository.save(cotacao);

        return ResponseEntity.ok("CNPJ alterado com sucesso!");
    }

    // ------------------- POST -------------------

    // Função para criar cotações para um item de requisição, com base nos fornecedores de uma clonagem
    public ResponseEntity<?> postRevisaoCotarClonagem(Long itemId, Long clonagemId, Long requisicaoId) throws BadRequestException {
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);
        ItemRequisicao itemRequisicao = itemRequisicaoService.assertItemRequisicao(itemId);
        Clonagem clonagem = clonagemService.assertClonagem(clonagemId);

        clonagem.getFornecedorClonagems().forEach(
                (fornecedorClonagem) -> {
                    // Pega o CNPJ matriz, se não existir, pega o primeiro CNPJ cadastrado
                    Optional<FornecedorCnpj> fornecedorCnpj =
                    fornecedorClonagem
                            .getFornecedor()
                            .getFornecedores()
                            .stream().filter(
                                    cnpj -> cnpj.getTipo() == FornecedorEnum.MATRIZ)
                            .findFirst();

                    if (fornecedorCnpj.isEmpty()){
                        fornecedorCnpj = fornecedorClonagem
                                .getFornecedor()
                                .getFornecedores()
                                .stream().findFirst();
                    }

                    if (fornecedorCnpj.isPresent()) {
                        Long fCnpjId = fornecedorCnpj.get().getFornecedorCnpjId();

                        boolean hasCotacao = itemRequisicao.getCotacoes().stream().anyMatch(
                                cotacao -> cotacao
                                        .getFornecedorCnpj()
                                        .getFornecedorCnpjId()
                                        .equals(fCnpjId));

                        if (hasCotacao) {
                            return;
                        }

                        Cotacao cotacao = Cotacao.builder()
                                    .itemRequisicao(itemRequisicao)
                                    .fornecedorCnpj(fornecedorCnpj.get())
                                    .createdAt(Date.valueOf(LocalDate.now()))
                                    .estadoCotacao(EstadoItemEnum.COTANDO)
                                    .requisicao(requisicao)
                                    .build();

                        cotacaoUtils.saveCotacao(cotacao);
                    }
                });

        return ResponseEntity.ok().build();
    }

    // Função para criar cotações para todos os itens de uma requisição, com base em CNPJs de um fornecedor
    public ResponseEntity<?> postRevisaoCotarCNPJsParaTodos(Long requisicaoId, RevisaoInsertCNPJDTO cnpjIds) throws BadRequestException {
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);

        List<ItemRequisicao> itensRequisicao = itemRequisicaoRepository.findAllByRequisicaoIdAndStatusIsTrue(requisicao.getRequisicaoId());

        // Testa se foram passados CNPJs específicos para serem adicionados
        if (cnpjIds.cnpjIds().isEmpty()){
            Fornecedor fornecedor = fornecedorService.assertFornecedor(cnpjIds.fornecedorId());

            Optional<FornecedorCnpj> cnpjMatriz = fornecedor.getFornecedores().stream().filter(
                    cnpj -> cnpj.getTipo() == FornecedorEnum.MATRIZ
            ).findFirst();

            if (cnpjMatriz.isEmpty()){
                throw new BadRequestException("Fornecedor não possui CNPJ matriz cadastrada!");
            }
            else{
                FornecedorCnpj fornecedorCnpj = cnpjMatriz.get();

                itensRequisicao.forEach(
                        itemRequisicao -> {
                            if (itemRequisicao.getCotacoes().stream().noneMatch(
                                    cotacao -> cotacao.getFornecedorCnpj().getFornecedorCnpjId().equals(fornecedorCnpj.getFornecedorCnpjId()))) {
                                saveSimpleCotacao(itemRequisicao, fornecedorCnpj, requisicao);
                            }
                        }
                );
            }
        }
        else{
            for (Long cnpjId : cnpjIds.cnpjIds()) {
                FornecedorCnpj fornecedorCnpj = fornecedorCnpjService.getCNPJbyId(cnpjId);

                itensRequisicao.forEach(
                        itemRequisicao -> {
                            if (itemRequisicao.getCotacoes().stream().noneMatch(
                                    cotacao -> cotacao.getFornecedorCnpj().getFornecedorCnpjId().equals(cnpjId))) {
                                saveSimpleCotacao(itemRequisicao, fornecedorCnpj, requisicao);
                            }
                        }
                );
            }
        }

        return ResponseEntity.ok().build();
    }

    // Função para inserir um item em uma requisição em estado de revisão
    public ResponseEntity<?> postRevisaoInserirItem(Long requisicaoId, InserirItemEmFaseCotacaoDTO item) throws BadRequestException {
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);
        Similar similar = similarService.getByReferencia(item.referencia());

        ItemRequisicao itemRequisicao = ItemRequisicao.builder()
                .requisicao(requisicao)
                .referencia(item.referencia())
                .quantidade(item.quantidade())
                .observacao(item.observacao())
                .similar(similar)
                .encontrado(similar != null)
                .status(true)
                .destino(item.destino())
                .estadoItem(EstadoItemEnum.COTANDO) // Estado inicial
                .build();

        itemRequisicaoService.saveItemRequisicao(itemRequisicao);

        switch (requisicao.getDestino()){
            case VENDA_ESTOQUE:
                break;
            case VENDA, ESTOQUE:
                if(!item.destino().equals(requisicao.getDestino())) {
                    requisicao.setDestino(DestinoEnum.VENDA_ESTOQUE);
                }
                break;
        }

        return ResponseEntity.ok("Item inserido com sucesso!");
    }

    // Função para cadastrar um novo produto e um novo idSimilar a esse produto e adicionar ele a um item de requisição
    public ResponseEntity<?> postRevisaoCadastrarNovoProduto(PostCotacaoRevisaoProdutoSimilarDTO item) throws BadRequestException {
        // Criação do produto
        Produto produto = produtoService.saveProduto(CadastroProdutoDTO.builder()
                                                        .nome(item.nomeProduto())
                                                        .descricao(item.descricao())
                                                        .subgrupoId(item.subgrupoId())
                                                        .unidadeId(item.unidadeId())
                                                        .build()
        );

        // Criação do idSimilar
        SubmitSimilarDTO similarDTO = SubmitSimilarDTO.builder()
                                        .referencia(item.referencia())
                                        .idMarca(item.marcaId())
                                        .observacao(item.observacao())
                                        .build();

        Similar similar = similarService.saveSimilar(similarDTO, produto.getProdutoId());

        itemRequisicaoService.patchSimilar(item.itemId(), similar.getSimilarId());

        return ResponseEntity.ok("Produto e idSimilar cadastrados e inseridos no item com sucesso!");
    }

    // Função para cadastrar um novo idSimilar e adicionar a um item de requisição
    public ResponseEntity<?> postRevisaoCadastrarNovoSimilar(PostRevisaoCadastrarSimilarDTO similarItemDTO) throws BadRequestException {
        // Criação do idSimilar
        SubmitSimilarDTO similarDTO = SubmitSimilarDTO.builder()
                                        .referencia(similarItemDTO.referencia())
                                        .idMarca(similarItemDTO.marcaId())
                                        .observacao(similarItemDTO.observacao())
                                        .build();

        Similar similar = similarService.saveSimilar(similarDTO, similarItemDTO.produtoId());

        itemRequisicaoService.patchSimilar(similarItemDTO.itemId(), similar.getSimilarId());

        return ResponseEntity.ok("Similar cadastrado e inserido no item com sucesso!");
    }

    // ------------------- PUT -------------------

    // Função para editar um item de requisição em estado de revisão
    public ResponseEntity<?> putRevisaoEditarItem(EditarItemRequisicaoDTO item, Long requisicaoId) throws BadRequestException {
        ItemRequisicao itemRequisicao = itemRequisicaoService.putEditItemRequisicao(item);

        AlertaItem alertaItem = AlertaItem.builder()
                .itemRequisicao(itemRequisicao)
                .descricao(item.justificativa())
                .build();

        alertaItemService.saveAlertaItem(alertaItem);

        return ResponseEntity.ok("Item editado com sucesso!");
    }

    // ------------------- DELETE -------------------

    // Função para deletar todas as cotações de um CNPJ de uma requisição
    public ResponseEntity<?> deleteRevisaoCNPJ(Long requisicaoId, DeleteDTO deleteDTO) throws BadRequestException {
        FornecedorCnpj fornecedorCnpj = fornecedorCnpjService.assertFornecedorCnpj(deleteDTO.idToDelete());

        fornecedorCnpj.getCotacoes().forEach(
            cotacao -> {
                if (cotacao.getFornecedorCnpj()
                        .getFornecedorCnpjId().equals(fornecedorCnpj.getFornecedorCnpjId())) {
                    System.out.println("Deletando cotação...");
                    System.out.println(cotacao);
                    cotacaoRepository.delete(cotacao);
                }}
        );

        return ResponseEntity.noContent().build();
    }

    // Função para deletar uma cotação
    public ResponseEntity<?> deleteRevisaoItemCotacao(DeleteDTO deleteDTO) throws BadRequestException {
        Cotacao cotacao = cotacaoUtils.assertCotacao(deleteDTO.idToDelete());

        cotacaoRepository.delete(cotacao);

        return ResponseEntity.noContent().build();
    }

    // Função para deletar um item de requisição em estado de revisão
    public ResponseEntity<?> deleteRevisaoItem(DeleteDTO deleteDTO) throws BadRequestException {
        System.out.println("Deletando item de requisição...");
        ItemRequisicao itemRequisicao = itemRequisicaoService.assertItemRequisicao(deleteDTO.idToDelete());
        System.out.println(itemRequisicao);

        itemRequisicao.setEstadoItem(EstadoItemEnum.REMOVIDO);
        System.out.println(itemRequisicao);
        itemRequisicaoService.saveItemRequisicao(itemRequisicao);
        System.out.println("Item removido com sucesso!");
        return ResponseEntity.noContent().build();
    }

    // ------------------- Utils -------------------

    // Função para salvar uma cotação
    private void saveSimpleCotacao(ItemRequisicao itemRequisicao, FornecedorCnpj fornecedorCnpj, Requisicao requisicao){
        if (itemRequisicao.getSimilar() == null) {
            return;
        }
        Cotacao cotacao = Cotacao.builder()
                .itemRequisicao(itemRequisicao)
                .fornecedorCnpj(fornecedorCnpj)
                .createdAt(Date.valueOf(LocalDate.now()))
                .requisicao(requisicao)
                .estadoCotacao(EstadoItemEnum.COTANDO)
                .build();

        cotacaoUtils.saveCotacao(cotacao);
    }

    public ResponseEntity<?> postRevisaoCotarCNPJs(Long requisicaoId, RevisaoInsertCNPJDTO insertCNPJDTO, Long itemId) throws BadRequestException {
        ItemRequisicao itemRequisicao = itemRequisicaoService.assertItemRequisicao(itemId);
        Requisicao requisicao = requisicaoService.assertRequisicao(requisicaoId);

        if (insertCNPJDTO.cnpjIds().isEmpty()) {
            Fornecedor fornecedor = fornecedorService.assertFornecedor(insertCNPJDTO.fornecedorId());

            Optional<FornecedorCnpj> cnpjMatriz = fornecedor.getFornecedores().stream().filter(
                    cnpj -> cnpj.getTipo() == FornecedorEnum.MATRIZ
            ).findFirst();
            if (cnpjMatriz.isEmpty()) {
                throw new BadRequestException("Fornecedor não possui CNPJ matriz cadastrada!");
            }

            if (itemRequisicao.getCotacoes().stream().noneMatch(
                    cotacao -> cotacao.getFornecedorCnpj().getFornecedorCnpjId().equals(cnpjMatriz.get().getFornecedorCnpjId()))) {
                Cotacao cotacao = Cotacao.builder()
                        .itemRequisicao(itemRequisicao)
                        .fornecedorCnpj(cnpjMatriz.get())
                        .createdAt(Date.valueOf(LocalDate.now()))
                        .estadoCotacao(EstadoItemEnum.COTANDO)
                        .requisicao(requisicao)
                        .build();

                cotacaoUtils.saveCotacao(cotacao);
            }
        }
        else{
            for (Long cnpjId : insertCNPJDTO.cnpjIds()) {
                FornecedorCnpj fornecedorCnpj = fornecedorCnpjService.assertFornecedorCnpj(cnpjId);

                if (itemRequisicao.getCotacoes().stream().noneMatch(
                        cotacao -> cotacao.getFornecedorCnpj().getFornecedorCnpjId().equals(cnpjId))) {
                    Cotacao cotacao = Cotacao.builder()
                            .itemRequisicao(itemRequisicao)
                            .fornecedorCnpj(fornecedorCnpj)
                            .createdAt(Date.valueOf(LocalDate.now()))
                            .estadoCotacao(EstadoItemEnum.COTANDO)
                            .requisicao(requisicao)
                            .build();

                    cotacaoUtils.saveCotacao(cotacao);
                }
            }

        }

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> patchRevisaoAlterarReferencia(Long itemId, Long similarId, Long requisicaoId) throws BadRequestException {
        itemRequisicaoService.patchSimilar(itemId, similarId);

        return ResponseEntity.ok("Referência alterada com sucesso!");
    }
}
