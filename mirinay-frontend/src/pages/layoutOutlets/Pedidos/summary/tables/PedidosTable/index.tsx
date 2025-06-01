import PedidosResponseData from "../../../../../../models/pedidos/PedidosResponseData.ts";
import {memo, useEffect} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import PedidoRow from "../../../components/rows/PedidoRow";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import PedidosHeader from "../../../components/headers/PedidosHeader";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import DropdownProvider from "../../../../../../contexts/dropdown/DropdownProvider";
import useSearch from "../../../../../../hooks/useSearch.ts";

/**
 * Tabela de exibição de grupos/subgrupos
 */
const PedidosTable = memo(
    function PedidosTable() {
        const {currentView, refresh} = useView();
        currentView.endpoint = useEndpoint().pedido().GET().pendentes;
        const { currentEndpoint, addSearchView } = useSearch();

        useEffect(() => {
            addSearchView("Código do CNPJ", useEndpoint().pedido().GET().SEARCH().pendente().id)
            addSearchView("Nome do fornecedor", useEndpoint().pedido().GET().SEARCH().pendente().nome)
        }, []);

        const {toggleRequest, data, isLoading, error, isError} = useFetch<PedidosResponseData>(currentEndpoint);

        // Primeira ativação da request para a API quando o componente é carregado (busca de dados inicial)
        useEffect(() => {
            toggleRequest();
        }, [toggleRequest, refresh]);

        const contentFunction =
            (dados: PedidosResponseData, index: number) => {
                return (
                    <DropdownProvider>
                        <PedidoRow
                            stripped={index % 2 == 1}
                            data={dados}
                        />
                    </DropdownProvider>
                );
            }

        const content = useTableContent<PedidosResponseData>({
            isLoading,
            error,
            isError,
            data: data as PedidosResponseData[],
            errorMessage: "Erro ao carregar fornecedores com itens a pedir!",
            contentFunction: contentFunction,
            beforeContent: () => <PedidosHeader/>
        });

        return (
            <TableContainer barContent={<TopBarContent
                hasPagination={true}
                hasSearch={true}
            />}>
                {content}
            </TableContainer>)
    });

export default PedidosTable;
