import EstadoEnum from "../../enums/EstadoEnum.ts";

export default function translateEstadoEnum(estado: EstadoEnum){
    switch(estado){
        case EstadoEnum.REMOVIDO:
            return "Removido";
        case EstadoEnum.DESCLASSIFICADO:
            return "Desclassificado";
        case EstadoEnum.NAOENCONTRADO:
            return "Não encontrado";
        case EstadoEnum.DESAPROVADO:
            return "Reprovado";
        case EstadoEnum.APROVADO:
            return "Aprovado";
        case EstadoEnum.COTANDO:
            return "Cotando";
        case EstadoEnum.PREAPROVADO:
            return "Pré-aprovado";
        case EstadoEnum.A_PEDIR:
            return "A pedir";
        case EstadoEnum.EMTRANSITO:
            return "Em trânsito";
        case EstadoEnum.ENTREGUE:
            return "Entregue";
        default:
            return "Desconhecido";
    }
}
