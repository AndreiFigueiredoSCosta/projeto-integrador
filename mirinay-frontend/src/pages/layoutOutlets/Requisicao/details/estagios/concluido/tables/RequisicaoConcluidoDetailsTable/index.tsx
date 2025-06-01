import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import { useEffect} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import RequisicaoConcluidoDetailsResponseData
    from "../../../../../../../../models/requisicao/concluido/RequisicaoConcluidoDetailsResponseData.ts";
import RequisicaoConcluidoRow from "../../../../../components/rows/estagios/concluido/RequisicaoConcluidoRow";
import RequisicaoConcluidoHeader from "../../../../../components/headers/RequisicaoConcluidoHeader";


/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function RequisicaoConcluidoDetailsTable() {
    const id = useParams().requisicaoId as unknown as number;
    const { globalRefresh } = useDetails();
    const { refresh } = useView();
    const endpoint = `${useEndpoint().requisicao().informacoes().subinformacoes(id).concluido}`;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<RequisicaoConcluidoDetailsResponseData>(endpoint);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: RequisicaoConcluidoDetailsResponseData, index: number) => {
        return (
            <RequisicaoConcluidoRow
                stripped={index % 2 == 1}
                data={dados}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<RequisicaoConcluidoDetailsResponseData>({
        isLoading,
        error,
        isError,
        data: data as RequisicaoConcluidoDetailsResponseData[],
        errorMessage: "Erro ao carregar produtos",
        contentFunction: contentFunction,
        beforeContent: () => <RequisicaoConcluidoHeader />
    });

    return (
            <TableContainer size={"small"} >
                {content}
            </TableContainer>
    );
}
