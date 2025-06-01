import PrioridadeEnum from "../../enums/PrioridadeEnum.ts";

export default function translatePrioridadeEnum(prioridade: PrioridadeEnum) {
    switch (prioridade) {
        case PrioridadeEnum.COMPRAR:
            return "Comprar";
        case PrioridadeEnum.COTAR:
            return "Cotar";
        default:
            return "Desconhecido";
    }
}
