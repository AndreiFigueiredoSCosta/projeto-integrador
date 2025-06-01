
import EstagioEnum from "../../enums/EstagioEnum.ts";
import PrioridadeEnum from "../../enums/PrioridadeEnum.ts";

export default interface RequisicaoResponseData {
    requisicaoId: number;
    nome: string;
    solicitante: string;
    cliente: string;
    prioridadeEnum: PrioridadeEnum;
    estagioEnum: EstagioEnum;
}
