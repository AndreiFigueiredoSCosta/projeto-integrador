package org.example.mirinayapi.model.endereco;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.mirinayapi.model.fabricante.Fabricante;
import org.example.mirinayapi.model.fornecedorCnpj.FornecedorCnpj;

import java.util.List;

@Entity(name = "endereco")
@Table(name = "endereco")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "endereco_id")
    private Long enderecoId;

    @NotBlank
    private String cep;

    @NotBlank
    private String numero;

    @NotBlank
    private String cidade;

    @NotBlank
    private String bairro;


    @NotBlank
    private String uf;

    @OneToMany (mappedBy = "endereco")
    @JsonIgnore
    private List<FornecedorCnpj> fornecedores;

    @OneToMany (mappedBy = "endereco")
    @JsonIgnore
    private List<Fabricante> fabricantes;
}
