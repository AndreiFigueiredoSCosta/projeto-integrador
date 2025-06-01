import {memo, useEffect} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import RequisicaoConcluidoResponseData from "../../../../../../models/requisicao/RequisicaoConcluidoResponseData.ts";
import RequisicaoConcluidoTableRow from "../../../components/rows/RequisicaoConcluidoTableRow";
import RequisicaoConcluidoHeader from "../../../components/headers/RequisicaoConcluidoHeader";
import useSearch from "../../../../../../hooks/useSearch.ts";

/**
 * Tabela de exibição de requisiçoes concluídas
 */
const RequisicaoConcluidoTable = memo( function RequisicaoConcluidoTable () {
    const { currentView, refresh } = useView();
    currentView.endpoint =  useEndpoint().requisicao().informacoes().concluidos;

    const { currentEndpoint, addSearchView } = useSearch();

    useEffect(() => {
        addSearchView("Código da requisição", useEndpoint().requisicao().search().concluida().id);
        addSearchView("Nome da requisição", useEndpoint().requisicao().search().concluida().nome);
    }, []);

    const { toggleRequest, data, isLoading, error, isError } = useFetch<RequisicaoConcluidoResponseData>(currentEndpoint);

    // Primeira ativação da request para a API quando o componente é carregado (busca de dados inicial)
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    const contentFunction =
        (dados: RequisicaoConcluidoResponseData, index: number) => {
        return (
            <RequisicaoConcluidoTableRow stripped={index % 2 == 1} data={dados}/>
        );
    }

    const content = useTableContent<RequisicaoConcluidoResponseData>({
        isLoading : isLoading,
        error : error,
        isError: isError,
        data: data as RequisicaoConcluidoResponseData[],
        errorMessage: "Erro ao carregar as requisições concluídas",
        contentFunction: contentFunction,
        beforeContent: () => <RequisicaoConcluidoHeader/>
    });

    return (
        <TableContainer barContent={<TopBarContent />}>
            {content}
        </TableContainer>)
});

export default RequisicaoConcluidoTable;
