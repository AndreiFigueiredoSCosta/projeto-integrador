import EstadoEnum from "../../../enums/EstadoEnum.ts";

export default interface CotacaoAprovacaoItemResponseData {
    cotacaoId: number
    fornecedorId: number
    nomeFornecedor: string
    estado: EstadoEnum
    quantidadeCotada: number
    classificacao: number
    detalhes: {
        precoUnit: number
        marca: string
        prazoEntr: number
        observacao: string
    }
}
