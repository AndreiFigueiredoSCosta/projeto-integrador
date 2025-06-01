export default interface CotacaoEditRequestData extends Record<string | symbol, unknown>{
    itemId: number,
    referencia: string,
    quantidade: number,
    observacao: string,
    estado: string
}
