import EstadoEnum from "../../../enums/EstadoEnum.ts";

export default interface CotacaoCotacaoItemResponseData {
    itemId: number;
    produtoId: number;
    similarId: number;
    nomeProduto: string;
    observacao: string;
    quantidade: number;
    estado: EstadoEnum;
    marca: string;
    referencia: string;
}
