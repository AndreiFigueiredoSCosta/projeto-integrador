import EstagioEnum from "../../enums/EstagioEnum.ts";

export default function translateEstagioEnum(estagio?: EstagioEnum){
    switch (estagio) {
        case EstagioEnum.APROVACAO:
            return "Aprovação";
        case EstagioEnum.CONCLUIDO:
            return "Concluído";
        case EstagioEnum.COTACAO:
            return "Cotação";
        case EstagioEnum.CONSTRUCAO:
            return "Construção";
        case EstagioEnum.PEDIDO:
            return "Pedido";
        case EstagioEnum.REVISAO:
            return "Revisão";
        case EstagioEnum.VALIDACAO:
            return "Aprovação";
        default:
            return "Desconhecido";
    }
}
