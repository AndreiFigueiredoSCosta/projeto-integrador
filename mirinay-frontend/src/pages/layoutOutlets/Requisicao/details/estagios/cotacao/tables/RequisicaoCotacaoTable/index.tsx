import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import RequisicaoCotacaoAlertModal from "../../modals/RequisicaoCotacaoAlertModal";
import RequisicaoCotacaoResponseData
    from "../../../../../../../../models/requisicao/cotacao/RequisicaoCotacaoResponseData.ts";
import RequisicaoCotacaoHeader from "../../../../../components/headers/estagios/cotacao/RequisicaoCotacaoHeader";
import RequisicaoCotacaoRow from "../../../../../components/rows/estagios/cotacao/RequisicaoCotacaoRow";

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function RequisicaoCotacaoTable() {
    const id = useParams().requisicaoId as unknown as number;
    const { globalRefresh } = useDetails();
    const { refresh } = useView();
    const endpoint = `${useEndpoint().requisicao().informacoes().subinformacoes(id).cotacao}`;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<RequisicaoCotacaoResponseData>(endpoint);
    const [ selected, setSelected ] = useState<RequisicaoCotacaoResponseData>();
    const [ hideAlertModal, setHideAlertModal ] = useState(true);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, data?: RequisicaoCotacaoResponseData) {

        switch (action){
            case "alert":
                setSelected(data);
                setHideAlertModal(false);
                break;
        }
    }, [setSelected, setHideAlertModal]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: RequisicaoCotacaoResponseData, index: number) => {
        return (
            <RequisicaoCotacaoRow
                stripped={index % 2 == 1}
                data={dados}
                handleAlert={() => handleClick("alert", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<RequisicaoCotacaoResponseData>({
        isLoading,
        error,
        isError,
        data: data as RequisicaoCotacaoResponseData[] | null,
        errorMessage: "Erro ao carregar produtos",
        contentFunction: contentFunction,
        beforeContent: () => <RequisicaoCotacaoHeader />
    });

    return (
        <>
            <RequisicaoCotacaoAlertModal
                hide={hideAlertModal}
                setHide={setHideAlertModal}
                data={selected}
            />

            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
