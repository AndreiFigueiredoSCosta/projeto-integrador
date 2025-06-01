
export default interface PedidoDetailsResponseData {
    pedidoId: number;
    dataCriacao: string;
    unidade: string;
    valorTotal: number;
    dataPrevista: string;
    condPgto: string;
    fornecedor: string;
    transportador: string;
    solicitante: string;
    frete: string;
    nfe: boolean;
}
