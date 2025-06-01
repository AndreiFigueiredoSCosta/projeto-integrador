import JSONType from "../../misc/JSONType.ts";
import DestinoEnum from "../../../enums/DestinoEnum.ts";

export default interface RequisicaoConstrucaoRequestData extends JSONType{
    itemId?: number,
    referencia: string,
    quantidade: number,
    observacao?: string,
    destino?: DestinoEnum,
    justificativa?: string
}
