package org.example.mirinayapi.controller;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.enums.requisicao.DestinoEnum;
import org.example.mirinayapi.model.itemRequisicao.DTO.ItemDetalhadoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.cotacao.ListagemSimilaresRevisaoCotacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.unificacao.ListagemItemEstoqueUnificacaoDTO;
import org.example.mirinayapi.model.itemRequisicao.DTO.unificacao.QuantidadeDTO;
import org.example.mirinayapi.model.misc.DeleteDTO;
import org.example.mirinayapi.model.requisicao.DTO.RequisicaoUnificacaoDTO;
import org.example.mirinayapi.service.ItemRequisicaoService;
import org.example.mirinayapi.service.RequisicaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/unificacao")
@AllArgsConstructor
public class UnificacaoController {

        private final ItemRequisicaoService itemRequisicaoService;
//        private final UnificacaoService unificacaoService;
        private final RequisicaoService requisicaoService;



        @GetMapping("/")
        public List<ListagemItemEstoqueUnificacaoDTO> listarItensRequisicaoPendentes() {
                DestinoEnum destinoEnum = DestinoEnum.ESTOQUE;
                List<ListagemItemEstoqueUnificacaoDTO> list = itemRequisicaoService.listarItensRequisicaoPorDestino(destinoEnum);
                System.out.println("bateu aqui");
                System.out.println("Listagem de itens pendentes: " + list);

                try {
                        System.out.println("bateu em try");
                        return list;
                } catch (Exception e) {
                        System.out.println("bateu em catch");
                        ResponseEntity.badRequest().body("Erro ao listar itens pendentes");
                        e.printStackTrace();
                        return list.isEmpty() ? null : list;
                }
        }
        @PostMapping("/unificar")
        public ResponseEntity<?> unificarRequisicoes(@RequestBody RequisicaoUnificacaoDTO requisicaoDTO) {
                try {
                        requisicaoService.unificarRequisicoes(requisicaoDTO);
                        return ResponseEntity.ok().body("Requisição criada e itens atualizados com sucesso.");
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.badRequest().body("Erro ao unificar requisições: " + e.getMessage());
                }
        }

        @GetMapping("/detalhes/{id}")
        public ResponseEntity<?> detalhesItemRequisicao(@PathVariable Long id) {
                try {
                        ItemDetalhadoDTO itens = itemRequisicaoService.listarItem(id);
                        return ResponseEntity.ok().body(itens);
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.badRequest().body("Erro ao buscar itens da requisição: " + e.getMessage());
                }
        }

        @GetMapping("/detalhes/{id}/similar")
        public ResponseEntity<?> detalhesSimilaresItemRequisicao(@PathVariable Long id) {
                try {
                        List<ListagemSimilaresRevisaoCotacaoDTO> itens = itemRequisicaoService.findSimilaresByItemId(id);
                        return ResponseEntity.ok().body(itens);
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.badRequest().body("Erro ao buscar itens da requisição: " + e.getMessage());
                }
        }

//        @PutMapping("/detalhes/{id}/idSimilar/selecionar")
//        public ResponseEntity<?> selecionarItemSimilar(@PathVariable Long id) {
//                try {
//                        itemRequisicaoService.selecionarItemSimilar(id);
//                        return ResponseEntity.ok().body("Item selecionado com sucesso.");
//                } catch (Exception e) {
//                        e.printStackTrace();
//                        return ResponseEntity.badRequest().body("Erro ao selecionar item: " + e.getMessage());
//                }
//        }

        @PutMapping("/detalhes/{id}/editar")
        public ResponseEntity<?> editarItemRequisicao(@PathVariable Long id, @RequestBody QuantidadeDTO quantidadeDTO) {
                try {
                        itemRequisicaoService.editarItemUnificado(id, quantidadeDTO);
                        return ResponseEntity.ok().body("Item editado com sucesso.");
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.badRequest().body("Erro ao editar item: " + e.getMessage());
                }
        }

        @DeleteMapping("/detalhes/{id}/excluir")
        public ResponseEntity<?> excluirItemRequisicao(@PathVariable Long id, @RequestBody DeleteDTO deleteDTO) {
                try {
                        itemRequisicaoService.excluirItem(id, deleteDTO);
                        return ResponseEntity.ok().body("Item excluído com sucesso.");
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.badRequest().body("Erro ao excluir item: ");
                }
        }
}
