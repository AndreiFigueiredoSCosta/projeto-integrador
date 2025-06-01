import EstadoEnum from "../../../enums/EstadoEnum.ts";

export default interface RequisicaoCotacaoResponseData {
    itemId: number
    referencia: string
    quantidade: number
    observacao: string
    estado: EstadoEnum
}
