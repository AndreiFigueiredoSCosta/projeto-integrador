import {memo, useEffect} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import EfetuadosRow from "../../../components/rows/EfetuadoRow/index.tsx";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import EfetuadosHeader from "../../../components/headers/EfetuadosHeader/index.tsx";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import EfetuadosResponseData from "../../../../../../models/pedidos/EfetuadosResponseData.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";

/**
 * Tabela de exibição de grupos/subgrupos
 */
const EfetuadosTable = memo( function PedidosTable () {
    const { currentView, refresh } = useView();
    currentView.endpoint = `${useEndpoint().pedido().GET().efetuados}`;

    const { currentEndpoint, addSearchView } = useSearch();

    useEffect(() => {
        addSearchView("Código do Pedido", useEndpoint().pedido().GET().SEARCH().efetuado().id)
        addSearchView("Nome do fornecedor", useEndpoint().pedido().GET().SEARCH().efetuado().nome)
    }, []);

    const { toggleRequest, data, isLoading, error, isError } = useFetch<EfetuadosResponseData[]>(currentEndpoint);

    // Primeira ativação da request para a API quando o componente é carregado (busca de dados inicial)
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    const contentFunction =
        (dados: EfetuadosResponseData, index: number) => {
        return (
            <EfetuadosRow stripped={index % 2 == 1} data={dados}/>
        );
    };

    const content = useTableContent<EfetuadosResponseData>({
        isLoading,
        error,
        isError,
        data: data as EfetuadosResponseData[],
        errorMessage: "Erro ao carregar pedidos concluídos",
        contentFunction: contentFunction,
        beforeContent: () => <EfetuadosHeader/>
    });

    return (
        <TableContainer barContent={<TopBarContent />}>
            {content}
        </TableContainer>)
});

export default EfetuadosTable;
