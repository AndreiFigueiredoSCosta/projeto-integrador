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
import ProdutoDetailsResponseData from "../../../../../../../models/produto/response/ProdutoDetailsResponseData.ts";
import idConversor from "../../../../../../../utils/idConversor.ts";

/**
 * Tabela de detalhes de grupo
 */
const ProdutoDetailsDataTable = memo( function ProdutoDetailsDataTable() {
    const produtoId = useParams().produtoId as unknown as number;
    const produtoEndpoint = useEndpoint().produto().informacoes(produtoId).unico;
    const { refresh } = useView();
    const { globalRefresh } = useDetails();
    const { data, isError, error, toggleRequest, isLoading, isSuccess } = useFetch<ProdutoDetailsResponseData>(produtoEndpoint);
    const dataMapped = data as ProdutoDetailsResponseData;

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh, globalRefresh]);

    const contentFunction = useCallback(() => {
        const nomeProduto: string = dataMapped?.nomeProduto ?? "Nome não encontrado.";
        const descricao: string = dataMapped?.descricao ?? "Descrição não encontrada.";
        const nomeGrupo: string = dataMapped?.nomeGrupo ?? "Grupo não encontrado.";
        const nomeSubgrupo: string = dataMapped?.nomeSubgrupo ?? "Subgrupo não encontrado.";
        const nomeUnidade: string = dataMapped?.nomeUnidade ?? "Unidade não encontrada.";
        const produtoId: string = idConversor(dataMapped.idProduto) ?? "Código não encontrado.";

        return (
            <>
                <DataTableColumn size={1}>
                    <DataTableRow size={1}>
                        <DataTableCell title={"Nome"} >
                            {produtoId}
                        </DataTableCell>
                        <DataTableCell>
                            {nomeProduto}
                        </DataTableCell>
                    </DataTableRow>
                    <DataTableRow size={1}>
                        <DataTableCell title={"Unidade"}>
                            {nomeUnidade}
                        </DataTableCell>
                    </DataTableRow>
                    <DataTableRow size={1}>
                        <DataTableCell title={"Grupo/subgrupo"}>
                            {nomeGrupo} / {nomeSubgrupo}
                        </DataTableCell>
                    </DataTableRow>
                </DataTableColumn>

                <DataTableColumn size={1}>
                    <DataTableRow>
                        <DataTableCell title={"Descrição"} contentTextSize={"small"}>
                            {descricao}
                        </DataTableCell>
                    </DataTableRow>
                    <DataTableRow>
                        <DataTableCell type={"blank"}>
                            --- EM PRODUÇÃO ---
                        </DataTableCell>
                    </DataTableRow>
                </DataTableColumn>
            </>
        );
    }, [dataMapped]);

    const content = useDataTableContent<ProdutoDetailsResponseData>({
        isLoading,
        isError,
        error,
        contentFunction: contentFunction,
        isSuccess,
        data: dataMapped,
        errorMessage: "Erro ao carregar os detalhes do produto."
    });

    return (
        <DataTableContainer rowsNumber={3}>
            {content}
        </DataTableContainer>
    );
});

export default ProdutoDetailsDataTable;
