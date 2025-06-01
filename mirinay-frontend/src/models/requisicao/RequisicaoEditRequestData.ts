export default interface RequisicaoEditRequestData extends Record<string | symbol, unknown> {
    nome: string;
    unidade: string;
    solicitante: string;
    cliente: string;
    prioridade: string;
    estagio: string;
    observacao: string;
    codigo: string;
    id: number;
}
