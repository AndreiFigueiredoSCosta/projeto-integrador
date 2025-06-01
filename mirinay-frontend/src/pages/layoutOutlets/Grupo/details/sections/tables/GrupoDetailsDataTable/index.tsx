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
import GrupoDetailsResponseData from "../../../../../../../models/grupo/response/GrupoDetailsResponseData.ts";

/**
 * Tabela de detalhes de grupo
 */
const GrupoDetailsDataTable = memo( function GrupoDetailsDataTable() {
    const grupoId = useParams().grupoId as unknown as number;
    const grupoEndpoint = useEndpoint().grupo().informacoes(grupoId).unico;
    const { refresh } = useView();
    const { globalRefresh } = useDetails();
    const { data, isError, error, toggleRequest, isLoading, isSuccess } = useFetch<GrupoDetailsResponseData>(grupoEndpoint);
    const dataMapped = data as GrupoDetailsResponseData;

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh, globalRefresh]);

    const contentFunction = useCallback(() => {
        const nome: string = dataMapped?.nome ?? "Nome não encontrado.";
        const qtdsubgrupo: string = dataMapped?.quantidadeSubgrupos ? `${dataMapped?.quantidadeSubgrupos}  Subgrupos`
            : "Nenhum subgrupo encontrado.";
        const descricao: string = dataMapped?.descricao ?? "Descrição não encontrada.";

        return (
            <>
                <DataTableColumn size={1}>
                    <DataTableRow size={1}>
                        <DataTableCell title={"Nome"}>
                            {nome}
                        </DataTableCell>
                    </DataTableRow>
                    <DataTableRow size={1}>
                        <DataTableCell title={"Subgrupos (QTD)"}>
                            {qtdsubgrupo}
                        </DataTableCell>
                    </DataTableRow>

                </DataTableColumn>

                <DataTableColumn size={1}>
                    <DataTableRow>
                        <DataTableCell title={"Descrição"} contentTextSize={"small"}>
                            {descricao}
                        </DataTableCell>
                    </DataTableRow>
                </DataTableColumn>
            </>
        );
    }, [dataMapped]);

    const content = useDataTableContent<GrupoDetailsResponseData>({
        isLoading,
        isError,
        error,
        contentFunction: contentFunction,
        isSuccess,
        data: dataMapped,
        errorMessage: "Erro ao carregar os detalhes do grupo."
    });

    return (
        <DataTableContainer rowsNumber={2}>
            {content}
        </DataTableContainer>
    );
});

export default GrupoDetailsDataTable;
