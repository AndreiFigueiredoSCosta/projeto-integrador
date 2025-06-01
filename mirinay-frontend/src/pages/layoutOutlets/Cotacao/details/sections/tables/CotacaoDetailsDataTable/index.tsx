import {memo, useCallback, useEffect} from "react";

import DataTableContainer from "../../../../../../../components/dataTable/DataTableContainer";
import DataTableColumn from "../../../../../../../components/dataTable/DataTableColumn/index.tsx";
import DataTableRow from "../../../../../../../components/dataTable/DataTableRow/index.tsx";
import DataTableCell from "../../../../../../../components/dataTable/DataTableCell/index.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import useDataTableContent from "../../../../../../../hooks/useDataTableContent.tsx";
import useView from "../../../../../../../hooks/useView.ts";
import RequisicaoResponseDetailsData from "../../../../../../../models/requisicao/RequisicaoResponseDetailsData.ts";
import idConversor from "../../../../../../../utils/idConversor.ts";
import DestinoEnum from "../../../../../../../enums/DestinoEnum.ts";
import translateDestinoEnum from "../../../../../../../utils/translators/translateDestinoEnum.ts";

/**
 * Tabela de detalhes de grupo
 */
const CotacaoDetailsDataTable = memo( function CotacaoDetailsDataTable() {
    const requisicaoId = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().requisicao().informacoes().subinformacoes(requisicaoId).detalhes;
    const { refresh } = useView();
    const { globalRefresh } = useDetails();
    const { data, isError, error, toggleRequest, isLoading, isSuccess } = useFetch<RequisicaoResponseDetailsData>(endpoint);
    const dataMapped = data as RequisicaoResponseDetailsData;

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh, globalRefresh]);

    const contentFunction = useCallback(() => {
        const nome: string = dataMapped?.nome ?? "Nome não encontrado.";
        const observacao: string = dataMapped?.observacao ?? "Observação não encontrada.";
        const prioridade: string = dataMapped?.prioridadeEnum ?? "Prioridade não encontrada.";
        const cliente: string = dataMapped?.cliente ?? "Cliente não encontrado.";
        const solicitante: string = dataMapped?.solicitante ?? "Solicitante não encontrado.";
        const unidade: string = dataMapped?.unidade ?? "Unidade não encontrada.";
        const requisicaoId: number = dataMapped?.requisicaoId ?? 0;
        const destino: DestinoEnum = dataMapped?.destinoEnum ?? translateDestinoEnum(DestinoEnum.VENDA_ESTOQUE)

        return (
            <>
                <DataTableColumn size={1}>
                    <DataTableRow size={1}>
                        <DataTableCell title={"Código"}>
                            {idConversor(requisicaoId)}
                        </DataTableCell>
                        <DataTableCell title={"Nome"}>
                            {nome}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell title={"Unidade"} contentTextSize={"small"}>
                            {unidade}
                        </DataTableCell>
                        <DataTableCell title={"Prioridade (Destino)"}>
                            {prioridade} ({translateDestinoEnum(destino)})
                        </DataTableCell>
                    </DataTableRow>
                </DataTableColumn>

                <DataTableColumn size={1}>
                    <DataTableRow>
                        <DataTableCell title={"Solicitante"}>
                            {solicitante}
                        </DataTableCell>
                        <DataTableCell title={"Cliente"}>
                            {cliente}
                        </DataTableCell>
                    </DataTableRow>
                    <DataTableRow>
                        <DataTableCell title={"Observação"} contentTextSize={"small"}>
                            {observacao}
                        </DataTableCell>
                    </DataTableRow>
                </DataTableColumn>
            </>
        );
    }, [dataMapped]);

    const content = useDataTableContent<RequisicaoResponseDetailsData>({
        isLoading,
        isError,
        error,
        contentFunction,
        isSuccess,
        data: dataMapped,
        errorMessage: "Erro ao carregar os detalhes da requisição."
    });

    return (
        <DataTableContainer rowsNumber={2}>
            {content}
        </DataTableContainer>
    );
});

export default CotacaoDetailsDataTable;
