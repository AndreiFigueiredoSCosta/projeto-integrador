package org.example.mirinayapi.service;

import lombok.AllArgsConstructor;
import org.example.mirinayapi.controller.AuthController;
import org.example.mirinayapi.model.permissao.Autorizacao;
import org.example.mirinayapi.model.permissao.Permissao;
import org.example.mirinayapi.model.permissao.dto.AutorizacaoDTO;
import org.example.mirinayapi.model.permissao.dto.PermissaoDTO;
import org.example.mirinayapi.model.permissao.repository.AutorizacaoRepository;
import org.example.mirinayapi.model.permissao.repository.PermissaoRepository;
import org.example.mirinayapi.model.usuario.LoginUserDto;
import org.example.mirinayapi.model.usuario.RegisterUserDto;
import org.example.mirinayapi.model.usuario.Usuario;
import org.example.mirinayapi.model.usuario.repositories.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AuthenticationService {
    private UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AutorizacaoRepository autorizacaoRepository;




    public List<Autorizacao> associarPermissoes(List<Long> autorizacaoIds) {
        return autorizacaoIds.stream()
                .map(id -> autorizacaoRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Autorização não encontrada com ID: " + id)))
                .toList();
    }


    public ResponseEntity<?> signup(RegisterUserDto input) {
        if (userRepo.findByEmail(input.getEmail()).isPresent()) {
            final String error = "Provided email is already in use.";
            final String message = "Please, navigate to the login section.";
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthController.ErrorDTO(error, message));
        }

        Usuario user = new Usuario();
        user.setName(input.getName());
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.setGender(input.getGender());
        user.setTelefone(input.getTelefone());

        // Salva o usuário
        userRepo.save(user);

        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
    public Usuario authenticate(LoginUserDto input){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );
        return userRepo.findByEmail(input.getEmail())
                .orElseThrow();
    }

    public List<String> listarPermissoes(Long id) {
        Usuario usuario = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return usuario.getPermissoes().stream()
                .map(permissao -> permissao.getAcaoPermissao().getPermissao().getModulo() + "_" + permissao.getAcaoPermissao().getAcao())
                .toList();
    }
}
