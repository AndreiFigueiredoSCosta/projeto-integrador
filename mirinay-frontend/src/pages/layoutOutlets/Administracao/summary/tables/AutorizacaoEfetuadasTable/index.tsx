import {memo, useEffect, useState} from "react";
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
import AutorizacaoRow from "../../../components/rows/AutorizacaoRow";
import DeletarAutorizacaoModal from "../../modals/DeletarAutorizacaoModal";
import ListaAcaoAutorizacaoResponseData
    from "../../../../../../models/administracao/ListaAcaoAutorizacaoResponseData.ts";

/**
 * Tabela de exibição de grupos/subgrupos
 */


const AutorizacaoEfetuadasTable = memo(
    function AutorizacaoTable() {
        const { currentView, refresh } = useView();
        currentView.endpoint = `${useEndpoint().administacao().GET().listarAutorizacoes}`;
        const { currentEndpoint, addSearchView } = useSearch();

        // Estado global para armazenar ações selecionadas de todas as permissões
        const [acoesSelecionadas, setAcoesSelecionadas] = useState<ListaAcaoAutorizacaoResponseData[]>([]);
        const [hideGerarAutorizacaoModal, setHideGerarAutorizacaoModal] = useState<boolean>(true);


        useEffect(() => {
            addSearchView("Código do CNPJ", useEndpoint().pedido().GET().SEARCH().pendente().id);
            addSearchView("Nome do fornecedor", useEndpoint().pedido().GET().SEARCH().pendente().nome);
        }, []);

        const { toggleRequest, data, isLoading, error, isError } = useFetch<AutorizacaoResponseData>(currentEndpoint);

        useEffect(() => {
            toggleRequest();
        }, [toggleRequest, refresh]);

        // Função para selecionar/deselecionar ações
        const handleSelectItem = (acaoData: ListaAcaoAutorizacaoResponseData) => {
            setAcoesSelecionadas((prev) => {
                if (prev.some((acao) => acao.acaoAutorizacaoId === acaoData.acaoAutorizacaoId)) {
                    return prev.filter((acao) => acao.acaoAutorizacaoId !== acaoData.acaoAutorizacaoId);
                }
                return [...prev, acaoData];
            });
        };


        const contentFunction = (dados: AutorizacaoResponseData, index: number) => {
            return (
                <DropdownProvider>
                    <AutorizacaoRow
                        stripped={index % 2 == 1}
                        data={dados}
                        acoesSelecionadas={acoesSelecionadas} // ✅ Agora é global
                        handleSelectItem={handleSelectItem} // ✅ Função global para seleção
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
            beforeContent: () => <AutorizacaoHeader />,
        });
        return (
            <>
                {/* Modal de autorização fora das permissões */}
                <DeletarAutorizacaoModal
                    hide={hideGerarAutorizacaoModal}
                    setHide={setHideGerarAutorizacaoModal}
                    acoesIds={acoesSelecionadas.map((acao) => acao.acaoAutorizacaoId)}
                    setAcoesSelecionadas={setAcoesSelecionadas}
                />

                {/* ✅ O botão agora está acima da tabela */}
                <TableContainer
                    barContent={<TopBarContent hasPagination={true} hasSearch={true} />}
                >
                    <div style={{ display: "flex", justifyContent: "flex-start", margin: "10px 0" }}>

                        <button
                            onClick={() => setHideGerarAutorizacaoModal(false)}
                            disabled={acoesSelecionadas.length === 0}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: acoesSelecionadas.length > 0 ? "#ff002e" : "#ccc",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: acoesSelecionadas.length > 0 ? "pointer" : "not-allowed"
                            }}
                        >
                            Deletar ações ({acoesSelecionadas.length} selecionadas)
                        </button>
                    </div>
                    {content}
                </TableContainer>
            </>
        );
    }
);
export default AutorizacaoEfetuadasTable;

