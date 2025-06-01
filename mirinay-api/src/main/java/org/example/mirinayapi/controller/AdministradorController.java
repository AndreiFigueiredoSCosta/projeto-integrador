package org.example.mirinayapi.controller;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.permissao.Permissao;
import org.example.mirinayapi.model.permissao.dto.AdicionarPermissaoDTO;
import org.example.mirinayapi.model.permissao.dto.AssociarPermissaoUsuarioDTO;
import org.example.mirinayapi.model.permissao.dto.AutorizacaoDTO;
import org.example.mirinayapi.service.PermissaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admnistrador")
@AllArgsConstructor
public class AdministradorController {
    private final PermissaoService permissaoService;

    @PostMapping("/atualizar")
    public ResponseEntity<String> atualizarPermissoes() {
        permissaoService.limparCachePermissoes();
        return ResponseEntity.ok("Permissões atualizadas!");
    }

    @PostMapping("/adicionar")
    public ResponseEntity<Permissao> adicionarAutorizacao(@RequestBody AutorizacaoDTO permissao) {
        permissaoService.salvarAutorizacao(permissao);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/adicionar/{id}/permissao")
    public ResponseEntity<Permissao> adicionarPermissao(@PathVariable Long id, @RequestBody AdicionarPermissaoDTO permissao) {
        permissaoService.salvarPermissao(permissao, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("adicionar/permissao/usuario")
    public ResponseEntity<Permissao> adicionarPermissaoUsuario(@RequestBody AssociarPermissaoUsuarioDTO permissao) {
        permissaoService.permissaoUsuario(permissao);
        return ResponseEntity.ok().build();
    }

}
