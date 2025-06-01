import EstagioEnum from "../../enums/EstagioEnum.ts";
import PrioridadeEnum from "../../enums/PrioridadeEnum.ts";

export default interface CotacaoResponseData {
    requisicaoId: number;
    nome: string;
    solicitante: string;
    prioridade: PrioridadeEnum;
    estagio: EstagioEnum;
}
