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
import idConversor from "../../../../../../../utils/idConversor.ts";
import FornecedorResponseData from "../../../../../../../models/fornecedor/response/FornecedorResponseData.ts";

/**
 * Tabela de detalhes de grupo
 */
const FornecedorDetailsDataTable = memo( function FornecedorDetailsDataTable() {
    const id = useParams().fornecedorId as unknown as number;
    const endpoint = useEndpoint().fornecedor().informacoes(id).unico;
    const { refresh } = useView();
    const { globalRefresh } = useDetails();
    const { data, isError, error, toggleRequest, isLoading, isSuccess } = useFetch<FornecedorResponseData>(endpoint);
    const dataMapped = data as FornecedorResponseData;

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

    const content = useDataTableContent<FornecedorResponseData>({
        isLoading,
        isError,
        error,
        contentFunction,
        isSuccess,
        data: dataMapped,
        errorMessage: "Erro ao carregar os detalhes do fornecedor."
    });

    return (
        <DataTableContainer rowsNumber={1}>
            {content}
        </DataTableContainer>
    );
});

export default FornecedorDetailsDataTable;
