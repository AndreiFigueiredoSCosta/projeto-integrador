import {memo, useEffect} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import DropdownProvider from "../../../../../../contexts/dropdown/DropdownProvider";
import useSearch from "../../../../../../hooks/useSearch.ts";

import AutorizacaoResponseData from "../../../../../../models/administracao/AutorizacaoResponseData.ts";
import AutorizacaoHeader from "../../../components/headers/AutorizacaoHeader";
import AutorizacaoUsuariosRow from "../../../components/rows/AutorizacaoUsuariosRow";

/**
 * Tabela de exibição de grupos/subgrupos
 */
interface UsuarioRowProps {
    handleInsert: (info: AutorizacaoResponseData) => void;
}


const UsuariosTable = memo(
    function AutorizacaoTable({handleInsert} : UsuarioRowProps) {
        const { currentView, refresh } = useView();
        currentView.endpoint = `${useEndpoint().administacao().GET().listarAutorizacoes}`;
        const { currentEndpoint, addSearchView } = useSearch();


        useEffect(() => {
            addSearchView("Código do CNPJ", useEndpoint().pedido().GET().SEARCH().pendente().id);
            addSearchView("Nome do fornecedor", useEndpoint().pedido().GET().SEARCH().pendente().nome);
        }, []);

        const { toggleRequest, data, isLoading, error, isError } = useFetch<AutorizacaoResponseData>(currentEndpoint);

        useEffect(() => {
            toggleRequest();
        }, [toggleRequest, refresh]);




        const contentFunction = (dados: AutorizacaoResponseData, index: number) => {
            return (
                <DropdownProvider>
                    <AutorizacaoUsuariosRow
                        handleInsert={handleInsert}
                        stripped={index % 2 == 1}
                        data={dados}
                    />
                </DropdownProvider>
            );
        };


        const content = useTableContent<AutorizacaoResponseData>({
            isLoading,
            error,
            isError,
            data: data as AutorizacaoResponseData[],
            errorMessage: "Erro ao carregar autorizações!",
            contentFunction: contentFunction,
            currentView: currentView,
            beforeContent: () => <AutorizacaoHeader />,
        });
        return (
            <>

                {/* ✅ O botão agora está acima da tabela */}
                <TableContainer
                    barContent={<TopBarContent hasPagination={true} hasSearch={true} />}
                >
                    <div style={{ display: "flex", justifyContent: "flex-start", margin: "10px 0" }}>

                    </div>
                    {content}
                </TableContainer>
            </>
        );
    }
);
export default UsuariosTable;

