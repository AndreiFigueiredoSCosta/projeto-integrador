import DestinoEnum from "../../enums/DestinoEnum.ts";

export default interface RequisicaoConcluidoResponseData {
    requisicaoId: number,
    nome: string,
    solicitante: string,
    aprovada: boolean,
    destinoEnum: DestinoEnum
}
