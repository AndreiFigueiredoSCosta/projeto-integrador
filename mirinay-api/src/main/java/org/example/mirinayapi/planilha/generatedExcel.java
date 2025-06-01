package org.example.mirinayapi.planilha;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.IOUtils;
import org.example.mirinayapi.model.MirinayModel;
import org.example.mirinayapi.planilha.dto.InfoDTO;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class generatedExcel {
    public byte[] generatedExcel(List<InfoDTO> products, MirinayModel companyInfo) throws IOException {
        // Create a Workbook
        HSSFWorkbook workbook = new HSSFWorkbook();


        HSSFSheet sheet = workbook.createSheet("Orçamento");

        // Adicionar a imagem ao cabeçalho
        String imagePath = "/images/imagem1.png";
        addImageToSheet(sheet, workbook, imagePath);

        String user = products.get(0).solicitante();

        System.out.println("user: " + user);
        // Adicionar o usuário solicitante
        addUserCell(sheet, workbook, user);

        // Adicionar a empresa ao cabeçalho
        addCompanyToSheet(sheet, workbook, companyInfo);

        // Preencher os dados da planilha
        fillProductData(sheet, products);

        // Adicionar rodapé
        addFooter(sheet, workbook);

        // Converter para byte array e retornar
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }

    private void addCompanyToSheet(HSSFSheet sheet, HSSFWorkbook workbook, MirinayModel companyInfo) {
        HSSFRow headerRow = sheet.getRow(1);
        if (headerRow == null) {
            headerRow = sheet.createRow(1);
        }

        // Ajustar a altura da linha para acomodar o texto
        headerRow.setHeightInPoints(50); // Ajuste conforme necessário

        // Ajustar a largura das colunas de A até G
        for (int col = 0; col <= 6; col++) {
            sheet.setColumnWidth(col, 5000); // Ajuste conforme necessário
        }

        // Mesclar as células de A até G na linha 2
        CellRangeAddress mergedRegion = new CellRangeAddress(1, 1, 0, 6);
        sheet.addMergedRegion(mergedRegion);

        // Criar estilo para a célula
        HSSFCellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER); // Centralizar o texto horizontalmente
        style.setVerticalAlignment(VerticalAlignment.CENTER); // Centralizar o texto verticalmente
        style.setWrapText(true);

        HSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        // Criar a célula e definir o valor
        Cell cell = headerRow.createCell(0);
        cell.setCellValue("Nome: " + companyInfo.getName().toUpperCase() + "\n" +
                " CNPJ: " + companyInfo.getCnpj() + "\n" +
                " Telefone: " + companyInfo.getPhone());
        cell.setCellStyle(style);

        // Aplicar bordas às células dentro da região mesclada
        for (int row = mergedRegion.getFirstRow(); row <= mergedRegion.getLastRow(); row++) {
            for (int col = mergedRegion.getFirstColumn(); col <= mergedRegion.getLastColumn(); col++) {
                Cell currentCell = sheet.getRow(row).getCell(col);
                if (currentCell == null) {
                    currentCell = sheet.getRow(row).createCell(col);
                }
                currentCell.setCellStyle(style);
            }
        }
    }
    private void addImageToSheet(HSSFSheet sheet, HSSFWorkbook workbook, String imagePath) throws IOException {
        // Ler o arquivo de imagem
        InputStream inputStream = getClass().getResourceAsStream(imagePath);
        if (inputStream == null) {
            throw new IOException("Imagem não encontrada: " + imagePath);
        }
        byte[] imageBytes = IOUtils.toByteArray(inputStream);
        int pictureIdx = sheet.getWorkbook().addPicture(imageBytes, Workbook.PICTURE_TYPE_PNG);
        inputStream.close();

        // Criar um DrawingPatriarch para inserir a imagem
        HSSFPatriarch drawing = sheet.createDrawingPatriarch();

        // Criar a linha 0, caso ainda não exista
        HSSFRow headerRow = sheet.getRow(0);
        if (headerRow == null) {
            headerRow = sheet.createRow(0);
        }

        // Ajustar a altura da linha 0 para acomodar a imagem
        headerRow.setHeightInPoints(50); // Ajuste a altura conforme necessário

        // Ajustar a largura das colunas de A até G
        for (int col = 0; col <= 6; col++) {
            sheet.setColumnWidth(col, 5000); // Ajuste a largura conforme necessário
        }

        // Definir o ancoramento (posição da imagem)
        HSSFClientAnchor anchor = new HSSFClientAnchor();
        anchor.setCol1(0); // Começa na coluna A (0)
        anchor.setRow1(0); // Começa na linha 0
        anchor.setCol2(7); // Termina na coluna G (7)
        anchor.setRow2(1); // Termina na linha 1 (altura da linha 0)

        // Adicionar a imagem à planilha
        drawing.createPicture(anchor, pictureIdx);
    }


    private void addUserCell(HSSFSheet sheet, HSSFWorkbook workbook, String user) {
        HSSFRow headerRow = sheet.getRow(2);
        if (headerRow == null) {
            headerRow = sheet.createRow(2);
        }

        // Ajustar a altura da linha para acomodar o texto
        headerRow.setHeightInPoints(20); // Ajuste conforme necessário

        // Ajustar a largura das colunas de A até G
        for (int col = 0; col <= 6; col++) {
            sheet.setColumnWidth(col, 5000); // Ajuste conforme necessário
        }

        // Mesclar as células de A até G na linha 2
        CellRangeAddress mergedRegion = new CellRangeAddress(2, 2, 0, 6);
        sheet.addMergedRegion(mergedRegion);

        // Criar estilo para a célula
        HSSFCellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER); // Centralizar o texto horizontalmente
        style.setVerticalAlignment(VerticalAlignment.CENTER); // Centralizar o texto verticalmente

        HSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        // Criar a célula na primeira coluna da região mesclada e definir o valor
        Cell cell = headerRow.createCell(0);
        cell.setCellValue("Solicitante: " + user);
        cell.setCellStyle(style);

        // Aplicar bordas às células dentro da região mesclada
        for (int row = mergedRegion.getFirstRow(); row <= mergedRegion.getLastRow(); row++) {
            for (int col = mergedRegion.getFirstColumn(); col <= mergedRegion.getLastColumn(); col++) {
                Cell currentCell = sheet.getRow(row).getCell(col);
                if (currentCell == null) {
                    currentCell = sheet.getRow(row).createCell(col);
                }
                currentCell.setCellStyle(style);
            }
        }
    }

    private void addFooter(HSSFSheet sheet, HSSFWorkbook workbook) {
        // Criação da linha do rodapé
        HSSFRow footerRow = sheet.createRow(sheet.getLastRowNum() + 1);

        footerRow.setHeightInPoints(30); // Ajuste conforme necessário

        // Mesclar as células de A até G na linha do rodapé
        CellRangeAddress mergedRegion = new CellRangeAddress(footerRow.getRowNum(), footerRow.getRowNum(), 0, 6);
        sheet.addMergedRegion(mergedRegion);

        // Criação da célula do rodapé
        HSSFCell footerCell = footerRow.createCell(0);
        footerCell.setCellValue("Aguardamos o seu retorno!");

        // Estilo para o rodapé
        HSSFFont footerFont = workbook.createFont();
        footerFont.setBold(true);
        footerFont.setFontHeightInPoints((short) 10);

        HSSFCellStyle footerStyle = workbook.createCellStyle();
        footerStyle.setAlignment(HorizontalAlignment.CENTER); // Centralizar horizontalmente
        footerStyle.setVerticalAlignment(VerticalAlignment.CENTER); // Centralizar verticalmente
        footerStyle.setFont(footerFont);
        footerStyle.setBorderBottom(BorderStyle.THIN);
        footerStyle.setBorderTop(BorderStyle.THIN);
        footerStyle.setBorderLeft(BorderStyle.THIN);
        footerStyle.setBorderRight(BorderStyle.THIN);

        // Aplicar o estilo à célula do rodapé
        footerCell.setCellStyle(footerStyle);

        // Aplicar bordas às células dentro da região mesclada
        for (int col = mergedRegion.getFirstColumn(); col <= mergedRegion.getLastColumn(); col++) {
            HSSFCell currentCell = footerRow.getCell(col);
            if (currentCell == null) {
                currentCell = footerRow.createCell(col);
            }
            currentCell.setCellStyle(footerStyle);
        }
    }

    private void fillProductData(HSSFSheet sheet, List<InfoDTO> products) {
        HSSFWorkbook workbook = sheet.getWorkbook();

        // Estilo para o cabeçalho (com bordas e negrito)
        HSSFCellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);

        HSSFFont headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        // Estilo para as células de dados (com bordas)
        HSSFCellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setAlignment(HorizontalAlignment.LEFT);
        dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        dataStyle.setBorderTop(BorderStyle.THIN);
        dataStyle.setBorderBottom(BorderStyle.THIN);
        dataStyle.setBorderLeft(BorderStyle.THIN);
        dataStyle.setBorderRight(BorderStyle.THIN);
        dataStyle.setWrapText(true); // Quebrar texto automaticamente

        int rowIndex = 3; // Começar após o cabeçalho e imagem

//        // Usuário solicitante
//        Row rowUser = sheet.createRow(rowIndex++);
//        Cell userCell = rowUser.createCell(3);
//        rowUser.setHeightInPoints(20); // Ajuste conforme necessário
//        userCell.setCellValue("Solicitante: " + products.get(0).solicitante());
//        userCell.setCellStyle(headerStyle);
        // Cabeçalho da tabela
        Row headerRow = sheet.createRow(rowIndex++);
        headerRow.setHeightInPoints(30); // Ajuste conforme necessário
        String[] headers = {"Produto", "Descrição", "Referências", "Fornecedor", "Marca", "Quantidade", "Preço"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle); // Aplicar estilo do cabeçalho com bordas
        }

        // Preenchimento dos dados dos produtos
        for (InfoDTO product : products) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(product.produto());
            row.createCell(1).setCellValue(product.descricao());

            // Referências em linhas separadas
            Cell refCell = row.createCell(2);
            String referencias = String.join("\n", product.referencias());
            refCell.setCellValue(referencias); // Referências em linhas separadas
            refCell.setCellStyle(dataStyle);

            row.createCell(3).setCellValue(product.fornecedor());
            row.createCell(4).setCellValue(product.marca());
            row.createCell(5).setCellValue(product.quantidade());
            row.createCell(6).setCellValue(product.preco().toString());

            // Aplicar estilo com bordas para todas as células
            for (int i = 0; i < headers.length; i++) {
                if (i != 2) { // As referências já têm o estilo aplicado
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
        }

        // Ajustar altura das linhas automaticamente para exibir todas as referências
        for (int i = 3; i <= sheet.getLastRowNum(); i++) {
            sheet.getRow(i).setHeightInPoints(sheet.getRow(i).getHeightInPoints() * 2); // Ajuste conforme necessário
        }
    }
}