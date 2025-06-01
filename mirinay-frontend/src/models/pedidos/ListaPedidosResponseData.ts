import destinoEnum from "../../enums/DestinoEnum.ts";

export default interface ListaPedidosResponseData {
    cotacaoId: number;
    itemId: number;
    fornecedorId: number;
    referencia: string;
    nomeProduto: string;
    requisicaoId: number;
    unidade: string;
    destino: destinoEnum;
    valorUnitario: number;
    quantidade: number;
    grupo: string;
    subgrupo: string;
}
