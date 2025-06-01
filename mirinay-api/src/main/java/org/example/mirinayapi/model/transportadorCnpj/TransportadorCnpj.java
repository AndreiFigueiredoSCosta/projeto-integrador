package org.example.mirinayapi.model.transportadorCnpj;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.mirinayapi.model.enums.FornecedorEnum;
import org.example.mirinayapi.model.pedidos.Pedido;
import org.example.mirinayapi.model.transportador.Transportador;

import java.util.List;

@Entity
@Table(name = "transportador_cnpj")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TransportadorCnpj {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "transportador_cnpj_id")
    private Long transportadorCnpjId;
    @NotBlank(message = "Nome do transportador não pode ser vazio")
    private String nome;
    @NotBlank(message = "CNPJ do transportador não pode ser vazio")
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "##.###.###/####-##")
    private String cnpj;
    private String endereco;
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "(##) #####-####")
    private String telefone;
    @Email
    private String celular;
    private String email;
    @Enumerated(EnumType.STRING)
    private FornecedorEnum tipo;

    @JsonIgnore
    private boolean status;

    @ManyToOne
    @JsonIgnore
    private Transportador transportador;

    @OneToMany(mappedBy = "transportadorCnpj", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Pedido> pedidos;
}
