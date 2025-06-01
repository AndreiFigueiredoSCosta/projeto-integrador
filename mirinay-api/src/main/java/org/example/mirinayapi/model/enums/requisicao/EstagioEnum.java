package org.example.mirinayapi.model.enums.requisicao;

public enum EstagioEnum {
    CONSTRUCAO, REVISAO, COTACAO, APROVACAO, VALIDACAO, PEDIDO , CONCLUIDO;

    public EstagioEnum getProximo() {
        EstagioEnum[] values = EstagioEnum.values();
        int ordinal = this.ordinal();
        if (ordinal < values.length - 1) {
            if (this.equals(APROVACAO)) {
                return PEDIDO;
            }
            return values[ordinal + 1];
        }
        return null;
    }
}
