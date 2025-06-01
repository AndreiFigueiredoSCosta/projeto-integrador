package org.example.mirinayapi.config;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.service.PermissaoService;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class DynamicPermissionConfigurer  {

    private final PermissaoService permissaoService;

    /**
     * Configura permissões dinâmicas para o HttpSecurity.
     */
    public void configure(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests(auth -> {
            // Permitir login sem autenticação
            auth.requestMatchers(HttpMethod.POST, "/auth/login").permitAll();
            auth.requestMatchers(HttpMethod.POST, "/admnistrador/**").permitAll();
            // Configurar permissões dinâmicas do banco de dados
            permissaoService.obterTodasAsPermissoes().forEach(permissao -> {
                permissao.getAcoes().forEach(acao -> {
                    String authority = acao.getEndpoint().toUpperCase() + "_" + acao.getAcao(); // Ex.: "ADMINISTRAÇÃO_GET"
                    String endpoint = acao.getEndpoint(); // Ex.: "/auth/**"
                    System.out.println("Configurando endpoint: " + endpoint + "/**");
                    System.out.println("Autoridade necessária: " + authority);
                    try {
                        auth.requestMatchers(HttpMethod.valueOf(acao.getMetodoHttp().toUpperCase()), "/"+endpoint+"/**")
                                .hasAuthority(authority);
                    } catch (Exception e) {
                        System.out.println("Erro ao configurar endpoint: " + e.getMessage());
                    }

                });
            });
            auth.anyRequest().denyAll();

        });
    }
}