import EstadoEnum from "../../../enums/EstadoEnum.ts";

export default interface CotacaoConcluidoItemResponseData {
    nomeFornecedor: string
    estado: EstadoEnum
    quantidadeCotada: number
    precoUnit: number
    prazoEntr: number
    observacao: string
}
