export default interface SubgrupoEditRequestData extends Record<string | symbol, unknown> {
    subgrupoId: number,
    nome: string,
    descricao: string,
    grupoId: number
}
