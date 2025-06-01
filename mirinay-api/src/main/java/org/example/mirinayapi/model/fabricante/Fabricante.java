package org.example.mirinayapi.model.fabricante;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.endereco.Endereco;

@Entity
@Table(name = "fabricante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fabricante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fabricante_id")
    private Long fabricanteId;
    @NotBlank(message = "Nome do fabricante não pode ser vazio")
    private String nome;
    @NotBlank(message = "Descrição do fabricante não pode ser vazia")
    private String descricao;
    @NotBlank(message = "Telefone do fabricante não pode ser vazio")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "## #####-####")
    private String telefone;
    @Email
    @NotBlank
    private String email;

    @ManyToOne
    @JoinColumn(name = "endereco")
    private Endereco endereco;

//    @OneToMany(mappedBy = "fabricante", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonIgnore
//    private List<Similar> produtos;
}
