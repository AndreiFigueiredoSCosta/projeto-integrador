import EstadoEnum from "../../../enums/EstadoEnum.ts";

export default interface CotacaoConcluidoResponseData {
    itemId: number
    produtoId: number
    nomeProduto: string
    estado: EstadoEnum
    quantidade: number

    marca: string
    referencia: string
    observacao: string
}
