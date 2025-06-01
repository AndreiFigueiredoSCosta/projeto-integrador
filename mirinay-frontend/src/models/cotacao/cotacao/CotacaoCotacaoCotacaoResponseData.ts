import EstadoEnum from "../../../enums/EstadoEnum.ts";

export default interface CotacaoCotacaoCotacaoResponseData {
    cotacaoId: number;
    nomeFornecedor: string;
    quantidade: number;
    precoUnit: number;
    estado: EstadoEnum;
    observacao: string;
    ipi: number;
    st: number;
    difal: boolean;
    margem: {
        margemId: number;
        nome: string;
        valor: number;
    };
    precoUltimaCotacao: number;
    dataUltimaCotacao: string;
}
