import DestinoEnum from "../../enums/DestinoEnum.ts";

export default interface CotacaoConcluidoResponseData {
    requisicaoId: number,
    nome: string,
    solicitante: string,
    aprovada: boolean,
    destino: DestinoEnum
}
