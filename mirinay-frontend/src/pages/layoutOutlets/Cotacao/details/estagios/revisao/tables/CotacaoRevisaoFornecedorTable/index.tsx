import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import CotacaoRevisaoFornecedorHeader
    from "../../../../../components/headers/estagios/revisao/CotacaoRevisaoFornecedorHeader";
import CotacaoRevisaoFornecedorResponseData
    from "../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoFornecedorResponseData.ts";
import CotacaoRevisaoFornecedorRow from "../../../../../components/rows/estagios/revisao/CotacaoRevisaoFornecedorRow";
import DeleteModal from "../../../../../../../../components/modals/DeleteModal";


/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function CotacaoRevisaoFornecedorTable() {
    const id = useParams().requisicaoId as unknown as number;
    const { globalRefresh } = useDetails();
    const { refresh, refreshView } = useView();
    const endpoint = `${useEndpoint().cotacao().GET().detalhes(id).revisao().fornecedor().cnpjs}`;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<CotacaoRevisaoFornecedorResponseData>(endpoint);
    const [ selected, setSelected ] = useState<CotacaoRevisaoFornecedorResponseData>();
    const [ hideDeleteModal, setHideDeleteModal ] = useState(true);

    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, data: CotacaoRevisaoFornecedorResponseData) {
            setSelected(data);
        switch (action){
            case "delete":
                setHideDeleteModal(false);
                break;
        }
    }, [setSelected, setHideDeleteModal]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: CotacaoRevisaoFornecedorResponseData, index: number) => {
        return (
            <CotacaoRevisaoFornecedorRow
                stripped={index % 2 == 1}
                data={dados}
                handleDelete={() => handleClick("delete", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<CotacaoRevisaoFornecedorResponseData>({
        isLoading,
        error,
        isError,
        data: data as CotacaoRevisaoFornecedorResponseData[],
        errorMessage: "Erro ao carregar fornecedores",
        contentFunction: contentFunction,
        beforeContent: () => <CotacaoRevisaoFornecedorHeader />
    });

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={useEndpoint().cotacao().DELETE().revisao(id).fornecedor().remover}
                errorMessage={"Erro ao remover fornecedor"}
                successMessage={"Fornecedor removido com sucesso!"}
                idToDelete={selected?.cnpjId as number}
                onDelete={() => {
                    refreshView();
                }}
            >
                Deseja realmente remover o fornecedor {selected?.nomeFantasia} de CNPJ {selected?.cnpj} de todas as requisições?
            </DeleteModal>
            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
