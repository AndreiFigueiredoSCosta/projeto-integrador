import FreteEnum from "../../enums/FreteEnum.ts";
import JSONType from "../misc/JSONType.ts";

export default interface PedidoGerarRequestData extends JSONType{
    fornecedorCnpjId: number;
    tempoEntrega: string;
    frete: FreteEnum;
    condPgto: string;
    transportadorId: number;
    unidadeId: number;
    cotacaoIds: number[];
}
