import PrioridadeEnum from "../../enums/PrioridadeEnum.ts";
import DestinoEnum from "../../enums/DestinoEnum.ts";

export default interface RequisicaoRequestData extends Record<string | symbol, unknown> {
    nome: string;
    cliente: string;
    prioridade: PrioridadeEnum;
    observacao?: string;
    destino: DestinoEnum;
    unidadeId: number;
}
