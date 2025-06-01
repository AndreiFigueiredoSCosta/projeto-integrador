export interface ListagemOrcamentoSimilarResponseData {
  similarId: number;
  nomeSimilar: string;
  marcaSimilar: string;
  valorAtacado: number;
  valorVarejo: number;
  quantidade: number;
  tipoDeMaquina: string;
  marcaMaquina: string;
}

export interface ExibirOrcamentoResponseData {
  orcamentoId: number;
  vendedor: string;
  cliente: string;
  valorTotal: number;
  data: Date;
  produtos: ListagemOrcamentoSimilarResponseData[]; // <- lista do outro objeto aqui
}
