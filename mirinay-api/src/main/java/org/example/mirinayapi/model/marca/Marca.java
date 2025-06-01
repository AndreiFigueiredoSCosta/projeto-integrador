package org.example.mirinayapi.model.marca;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.mirinayapi.model.similar.Similar;

import java.util.List;

@Entity(name = "marca")
@Table(name = "marca")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_marca")
    private Long id;
    @NotBlank(message = "O campo nome é obrigatório")
    @Size(min = 3, max = 50, message = "O campo nome deve ter entre 3 e 50 caracteres")
    @NotNull(message = "O campo nome é obrigatório")
    private String nome;

    @JsonIgnore
    private Boolean status;


    @OneToMany(mappedBy = "marca", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Similar> produtos;


    public Marca(Long id, String marca) {
        this.id =  id;
        this.nome = marca;

    }
}
