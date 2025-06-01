package org.example.mirinayapi.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;
import org.example.mirinayapi.model.permissao.dto.AutorizacaoDTO;
import org.example.mirinayapi.model.usuario.LoginUserDto;
import org.example.mirinayapi.model.usuario.RegisterUserDto;
import org.example.mirinayapi.model.usuario.Usuario;
import org.example.mirinayapi.security.JwtService;
import org.example.mirinayapi.service.AuthenticationService;
import org.example.mirinayapi.service.PermissaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final PermissaoService permissaoService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto){
         return authenticationService.signup(registerUserDto);

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto){
        Usuario authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse()
                .setToken(jwtToken)
                .setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }


    @PostMapping
    public ResponseEntity<String> criarAutorizacao(@RequestBody AutorizacaoDTO dto) {
        permissaoService.salvarAutorizacao(dto);
        return ResponseEntity.ok("Autorização criada com sucesso!");

    }

    @GetMapping("/usuarios/{id}/permissoes")
    public ResponseEntity<List<String>> listarPermissoes(@PathVariable Long id) {
        List<String> permissoes = authenticationService.listarPermissoes(id);
        return ResponseEntity.ok(permissoes);
    }
    public static record ErrorDTO(
            String error,
            String message
    ) { }

}



@Data
@Accessors(chain = true)
class LoginResponse {
    private String token;
    private long expiresIn;
}
