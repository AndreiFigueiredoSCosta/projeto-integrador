package org.example.mirinayapi.model.permissao.enums;

public enum ModuloEnum {
    ADMINISTRACAO("ADMINISTRAÇÃO"),
    COMPRAS("COMPRAS"),
    CADASTROS("CADASTROS"),
    ESTOQUE("ESTOQUE"),
    FINANCEIRO("FINANCEIRO");

    private final String nome;

    ModuloEnum(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}
