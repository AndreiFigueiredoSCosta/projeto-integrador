export default interface AprovacaoDetailsRequestData extends Record<string | symbol, unknown>{

    codigo: number;
    nome: string;
    solicitante: string;
    cliente: string;
    prioridade: string;
    observacao?: string;
    destino: string;

}