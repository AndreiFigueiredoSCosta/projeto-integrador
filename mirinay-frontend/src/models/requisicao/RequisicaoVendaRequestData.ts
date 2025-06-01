export default interface RequisicaoVendaRequestData extends Record<string | symbol, unknown> {
    nome: string;
    cliente: string;
    prioridade: string;
    estagio: string;
    observacao: string;
    codigo: string;
    id: number;
}
