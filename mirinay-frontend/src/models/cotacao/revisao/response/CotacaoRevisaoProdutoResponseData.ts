import JSONType from "../../../misc/JSONType.ts";
import DestinoEnum from "../../../../enums/DestinoEnum.ts";
import EstadoEnum from "../../../../enums/EstadoEnum.ts";

export default interface CotacaoRevisaoProdutoResponseData extends JSONType {
    itemId: number,
    produtoId: number,
    similarId: number,
    encontrado: boolean,
    referencia: string,
    nomeProduto: string,
    grupo: string,
    subgrupo: string,
    quantidade: number,
    observacao: string,
    destino: DestinoEnum,
    estado: EstadoEnum
}
