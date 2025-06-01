package org.example.mirinayapi.planilha;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.example.mirinayapi.model.MirinayModel;
import org.example.mirinayapi.model.marca.Marca;
import org.example.mirinayapi.model.similar.Similar;
import org.example.mirinayapi.model.similar.repositories.ProdutoSimilarRepository;
import org.example.mirinayapi.planilha.dto.InfoDTO;

import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class gen {


    private final ProdutoSimilarRepository produtoSimilarRepository;

    public static void main(String[] args) throws IOException {
        generatedExcel generator = new generatedExcel();

        // Exemplo de dados
        List<InfoDTO> products = new ArrayList<>();
        products.add(new InfoDTO("Produto 1", "fran", "DESCRICAO 1",List.of("Ref 1", "Ref 2"), "Fornecedor 1", "Marca 1", 10, BigDecimal.valueOf(100.0)));
        products.add(new InfoDTO("Produto 2", "fran", "DESCRICAO 2",List.of("Ref 3", "Ref 4"), "Fornecedor 2", "Marca 2", 20, BigDecimal.valueOf(200.0)));
        MirinayModel companyInfo = new MirinayModel();
        companyInfo.setName("MIRINAY COMERCIO DE PEÇAS AGRÍCOLAS LTDA ME");
        companyInfo.setCnpj("01.780.181/0001-89");
        companyInfo.setPhone("(55) 3433-7726");

        // Caminho da imagem
        String imagePath = "caminho/para/imagem.png";

        // Gerar Excel
        byte[] excelBytes = generator.generatedExcel(products, companyInfo);

        String sheetName = "Orçamento_"+ LocalDateTime.now().toString().replace(":", "-").replace(".", "-");

        // Salvar o arquivo (opcional)
        try (FileOutputStream fos = new FileOutputStream(sheetName + ".xls")) {
            fos.write(excelBytes);
        }
    }

    @Getter
    @Setter
    static class CompanyInfo {
        private String name;
        private String cnpj;
        private String phone;

        // Getters e Setters
    }
}
