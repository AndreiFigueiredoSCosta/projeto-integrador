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
import TransportadorResponseData from "../../../../../../../models/transportador/response/TransportadorResponseData.ts";
import idConversor from "../../../../../../../utils/idConversor.ts";

/**
 * Tabela de detalhes de grupo
 */
const TransportadorDetailsDataTable = memo( function TransportadorDetailsDataTable() {
    const id = useParams().transportadorId as unknown as number;
    const produtoEndpoint = useEndpoint().transportador().informacoes(id).unico;
    const { refresh } = useView();
    const { globalRefresh } = useDetails();
    const { data, isError, error, toggleRequest, isLoading, isSuccess } = useFetch<TransportadorResponseData>(produtoEndpoint);
    const dataMapped = data as TransportadorResponseData;

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh, globalRefresh]);

    const contentFunction = useCallback(() => {
        const nome: string = dataMapped?.nome ?? "Nome não encontrado.";

        return (
            <>
                <DataTableColumn size={1}>
                    <DataTableRow size={1}>
                        <DataTableCell title={"Nome"} >
                            {idConversor(id)} - {nome}
                        </DataTableCell>
                    </DataTableRow>
                </DataTableColumn>
            </>
        );
    }, [dataMapped]);

    const content = useDataTableContent<TransportadorResponseData>({
        isLoading,
        isError,
        error,
        contentFunction: contentFunction,
        isSuccess,
        data: dataMapped,
        errorMessage: "Erro ao carregar os detalhes do transportador."
    });

    return (
        <DataTableContainer rowsNumber={1}>
            {content}
        </DataTableContainer>
    );
});

export default TransportadorDetailsDataTable;
