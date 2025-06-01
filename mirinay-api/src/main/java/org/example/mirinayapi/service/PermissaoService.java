package org.example.mirinayapi.service;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.model.permissao.AcaoPermissao;
import org.example.mirinayapi.model.permissao.Autorizacao;
import org.example.mirinayapi.model.permissao.Permissao;
import org.example.mirinayapi.model.permissao.UsuarioPermissao;
import org.example.mirinayapi.model.permissao.dto.AdicionarPermissaoDTO;
import org.example.mirinayapi.model.permissao.dto.AssociarPermissaoUsuarioDTO;
import org.example.mirinayapi.model.permissao.dto.AutorizacaoDTO;
import org.example.mirinayapi.model.permissao.repository.AutorizacaoRepository;
import org.example.mirinayapi.model.permissao.repository.PermissaoRepository;
import org.example.mirinayapi.model.permissao.repository.UsuarioPermissaoRepository;
import org.example.mirinayapi.model.usuario.Usuario;
import org.example.mirinayapi.model.usuario.repositories.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class PermissaoService {

    private final PermissaoRepository permissaoRepository;
    private final AutorizacaoRepository autorizacaoRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final UsuarioPermissaoRepository usuarioPermissaoRepository;
    private final UserRepo userRepo;
    private static final Logger logger = LoggerFactory.getLogger(PermissaoService.class);

    @Cacheable("permissoes")
    public List<Permissao> obterTodasAsPermissoes() {
        return permissaoRepository.findAll();
    }

    @CacheEvict(value = "permissoes", allEntries = true)
    public void limparCachePermissoes() {
        System.out.println("Cache de permissões limpo!");
    }

    public void salvarAutorizacao(AutorizacaoDTO dto) {
        try {
            // Criar uma nova autorização
            Autorizacao autorizacao = new Autorizacao();
            autorizacao.setNome(dto.nome());
            autorizacao.setDescricao(dto.descricao());
            logger.info("Criando autorização: {}", dto.nome());

            // Buscar permissões pelo ID e associá-las à autorização
            List<Permissao> permissoes = dto.permissoes().stream()
                    .map(permissaoId -> permissaoRepository.findById(permissaoId)
                            .orElseThrow(() -> new IllegalArgumentException("Permissão não encontrada para ID: " + permissaoId)))
                    .toList();

            Permissao permissao = new Permissao();

            // Associar as permissões à autorização
            autorizacao.setPermissoesAssociadas(permissoes);

            // Salvar a autorização no banco de dados
            autorizacaoRepository.save(autorizacao);

            logger.info("Autorização '{}' salva com sucesso junto com as permissões associadas.", dto.nome());
            limparCachePermissoes();
        } catch (IllegalArgumentException e) {
            logger.error("Erro de validação: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Erro ao salvar autorização: {}", e.getMessage(), e);
        }
    }

    public void salvarPermissao(AdicionarPermissaoDTO dto, Long idAutorizacao) {
        try {
            Autorizacao autorizacao = autorizacaoRepository.findById(idAutorizacao).orElseThrow();
                Permissao permissao = new Permissao();
                permissao.setModulo(dto.modulo());
                permissao.setAutorizacoes(List.of(autorizacao));
                permissao.setAcoes(dto.acoes());
                permissaoRepository.save(permissao);
                System.out.println("Criando permissão para módulo: " );
                limparCachePermissoes();

        } catch (Exception e) {
            System.out.println("Erro ao salvar autorização: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void permissaoUsuario(AssociarPermissaoUsuarioDTO dto) {
        try {
            Autorizacao autorizacao = autorizacaoRepository.findById(dto.idAutorizacao())
                    .orElseThrow(() -> new IllegalArgumentException("Autorização não encontrada para ID: " + dto.idAutorizacao()));

            Usuario usuario = userRepo.findById(dto.idUsuario())
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado para ID: " + dto.idUsuario()));

            List<Permissao> permissoes = new ArrayList<>(autorizacao.getPermissoesAssociadas()); // Obter permissões associadas
            if (permissoes.isEmpty()) {
                logger.warn("Nenhuma permissão encontrada para a autorização: {}", dto.idAutorizacao());
                return;
            }

            permissoes.forEach(permissao -> permissao.getAcoes().forEach(acao -> {
                UsuarioPermissao usuarioPermissao = new UsuarioPermissao();
                usuarioPermissao.setUsuario(usuario.getId());
                usuarioPermissao.setAcaoPermissao(acao);
                usuarioPermissao.setPermitido(true);
                usuarioPermissaoRepository.save(usuarioPermissao);
            }));

            logger.info("Permissões associadas ao usuário: {} para autorização: {}", usuario.getId(), autorizacao.getNome());
            limparCachePermissoes();
        } catch (IllegalArgumentException e) {
            logger.warn("Erro de validação: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Erro ao associar permissões ao usuário: {}", e.getMessage(), e);
        }
    }

}
