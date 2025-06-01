import DestinoEnum from "../../../enums/DestinoEnum.ts";

export default interface RequisicaoConstrucaoResponseData{
    itemId: number,
    referencia: string,
    quantidade: number,
    observacao: string,
    destino: DestinoEnum
}
