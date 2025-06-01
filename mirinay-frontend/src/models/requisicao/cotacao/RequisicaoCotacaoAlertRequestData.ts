import JSONType from "../../misc/JSONType.ts";

export default interface RequisicaoCotacaoAlertRequestData extends JSONType{
    itemId: number,
    alerta: string
}
