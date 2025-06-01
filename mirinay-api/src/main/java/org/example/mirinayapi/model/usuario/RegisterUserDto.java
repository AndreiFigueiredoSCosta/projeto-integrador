package org.example.mirinayapi.model.usuario;

import lombok.Getter;
import lombok.Setter;
import org.example.mirinayapi.model.permissao.dto.PermissaoDTO;

import java.util.List;

@Getter
@Setter
public class RegisterUserDto {
    private String email;
    private String password;
    private String name;
    private String telefone;
    private String gender;

    private List<Long> autorizacaoIds;
}
