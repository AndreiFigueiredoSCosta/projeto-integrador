import PrioridadeEnum from "../../enums/PrioridadeEnum.ts";
import EstagioEnum from "../../enums/EstagioEnum.ts";
import DestinoEnum from "../../enums/DestinoEnum.ts";

export default interface RequisicaoResponseDetailsData{
    requisicaoId: number,
    nome: string,
    unidade: string,
    solicitante: string,
    cliente: string,
    prioridadeEnum: PrioridadeEnum,
    estagioEnum: EstagioEnum,
    observacao: string,
    destinoEnum: DestinoEnum
    aprovada: boolean;
}
