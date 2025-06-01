import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import { useEffect} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import RequisicaoPedidoRow from "../../../../../components/rows/estagios/pedido/RequisicaoPedidoRow";
import RequisicaoPedidoHeader from "../../../../../components/headers/estagios/pedido/RequisicaoPedidoHeader";
import GetItensDTO from "../../../../../../../../models/requisicao/GetItensDTO.ts";


/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function RequisicaoPedidoTable() {
    const id = useParams().requisicaoId as unknown as number;
    const { globalRefresh } = useDetails();
    const { refresh } = useView();
    const endpoint = `${useEndpoint().requisicao().informacoes().subinformacoes(id).pedido}`;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<GetItensDTO>(endpoint);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: GetItensDTO, index: number) => {
        return (
            <RequisicaoPedidoRow
                stripped={index % 2 == 1}
                data={dados}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<GetItensDTO>({
        isLoading,
        error,
        isError,
        data: data as GetItensDTO[],
        errorMessage: "Erro ao carregar produtos",
        contentFunction: contentFunction,
        beforeContent: () => <RequisicaoPedidoHeader />
    });

    return (
            <TableContainer size={"small"} >
                {content}
            </TableContainer>
    );
}
