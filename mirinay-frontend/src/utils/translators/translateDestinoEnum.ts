import DestinoEnum from "../../enums/DestinoEnum.ts";

export default function translateDestinoEnum(destino: DestinoEnum): string {
    switch (destino) {
        case DestinoEnum.ESTOQUE:
            return "Estoque";
        case DestinoEnum.VENDA:
            return "Venda";
        case DestinoEnum.VENDA_ESTOQUE:
            return "Venda/Estoque";
        default:
            return "Desconhecido";
    }
}
