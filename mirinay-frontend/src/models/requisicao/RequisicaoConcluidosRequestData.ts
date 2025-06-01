export default interface RequisicaoConcluidosRequestData extends Record<string | symbol, unknown> {
    nome: string;
    solicitante: string;
    destino: string;
    status: string;
    id: number;
}
