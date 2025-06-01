import EstadoEnum from "../../../enums/EstadoEnum.ts";

export default interface CotacaoCotacaoFornecedorItemResponseData {
    cotacaoId: number;
    quantidadeItem: number;
    quantidadeCotada: number;
    estado: EstadoEnum;
    marca: string;
    referencia: string;
    precoUnit: number;
    ipi: number;
    st: number;
    difal: boolean;
    observacao: string;
    margem: {
        margemId: number;
        nome: string;
        valor: number;
    };
    dataUltimaCotacao: Date;
    precoUltimaCotacao: number;
}
