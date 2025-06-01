import JSONType from "../../../misc/JSONType.ts";
import DestinoEnum from "../../../../enums/DestinoEnum.ts";

export default interface CotacaoRevisaoItemRequestData extends JSONType{
    itemId?: number,
    referencia: string,
    quantidade: number,
    observacao: string,
    justificativa: string,
    destino: DestinoEnum
}
