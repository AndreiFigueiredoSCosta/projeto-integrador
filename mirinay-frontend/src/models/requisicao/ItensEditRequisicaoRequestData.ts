export default interface ItensEditRequisicaoRequestData extends Record<string | symbol, unknown> {
    itemId: number;
    referencia: string;
    quantidade: number;
    observacao: string;
}
