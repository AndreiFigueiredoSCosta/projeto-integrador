export default interface ProdutoRequisicaoRequestData extends Record<string | symbol, unknown> {
    referencia: string;
    quantidade: number;
    observacao: string;
}
