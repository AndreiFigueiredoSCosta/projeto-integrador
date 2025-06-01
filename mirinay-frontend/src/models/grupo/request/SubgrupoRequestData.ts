export default interface SubgrupoRequestData extends Record<string | symbol, unknown>{
    grupoId: number,
    nome: string,
    descricao: string
}
