import EstadoEnum from "../../../enums/EstadoEnum.ts";
import DestinoEnum from "../../../enums/DestinoEnum.ts";

export default interface CotacaoAprovacaoResponseData {
    itemId: number
    nomeProduto: string
    estado: EstadoEnum
    quantidade: number

    produtoId: number
    marca: string
    referencia: string
    observacao: string
    destino: DestinoEnum
}
