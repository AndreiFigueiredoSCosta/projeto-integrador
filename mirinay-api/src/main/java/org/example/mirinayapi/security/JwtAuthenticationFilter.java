package org.example.mirinayapi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpHeaders;

import java.io.IOException;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        System.out.println("JWT Authentication Filter ativado para: " + request.getRequestURI());

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Verificar se o cabeçalho Authorization está presente e se é do tipo Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String userEmail;

        try {
            // Extrair o email do usuário do token JWT
            userEmail = jwtService.extractUsername(jwt);

            // Validar se há usuário no contexto de segurança
            Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
            if (userEmail != null && (currentAuth == null || !userEmail.equals(currentAuth.getName()))) {
                // Carregar detalhes do usuário a partir do banco de dados ou cache
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // Validar o token JWT
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Criar o token de autenticação
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // Configurar detalhes da requisição no token
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Registrar o token no contexto de segurança
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Logar a exceção para depuração
            System.err.println("Erro ao processar JWT: " + e.getMessage());
            e.printStackTrace();
        }

        // Continuar a cadeia de filtros
        filterChain.doFilter(request, response);
    }
}
