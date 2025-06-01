import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import DropdownProvider from "../../../../../../contexts/dropdown/DropdownProvider";
import useSearch from "../../../../../../hooks/useSearch.ts";
import PermissaoResponseData from "../../../../../../models/administracao/PermissaoResponseData.ts";
import PermissaoHeader from "../../../components/headers/PermissaoHeader";
import PermissaoRow from "../../../components/rows/PermissaoRow";
import ListaAcaoResponseData from "../../../../../../models/administracao/ListaAcaoResponseData.ts";
import GerarAutorizacaoModal from "../../modals/GerarAutorizacaoModal";

/**
 * Tabela de exibição de grupos/subgrupos
 */


const AutorizacaoTable = memo(
    function AutorizacaoTable() {
        const { currentView, refresh } = useView();
        currentView.endpoint = useEndpoint().administacao().GET().listar;
        const { currentEndpoint, addSearchView } = useSearch();

        // Estado global para armazenar ações selecionadas de todas as permissões
        const [acoesSelecionadas, setAcoesSelecionadas] = useState<ListaAcaoResponseData[]>([]);
        const [hideGerarAutorizacaoModal, setHideGerarAutorizacaoModal] = useState<boolean>(true);

        useEffect(() => {
            addSearchView("Código do CNPJ", useEndpoint().pedido().GET().SEARCH().pendente().id);
            addSearchView("Nome do fornecedor", useEndpoint().pedido().GET().SEARCH().pendente().nome);
        }, []);

        const { toggleRequest, data, isLoading, error, isError } = useFetch<PermissaoResponseData>(currentEndpoint);

        useEffect(() => {
            toggleRequest();
        }, [toggleRequest, refresh]);

        // Função para selecionar/deselecionar ações
        const handleSelectItem = (acaoData: ListaAcaoResponseData) => {
            setAcoesSelecionadas((prev) => {
                if (prev.some((acao) => acao.id === acaoData.id)) {
                    return prev.filter((acao) => acao.id !== acaoData.id);
                }
                return [...prev, acaoData];
            });
        };

        const contentFunction = (dados: PermissaoResponseData, index: number) => {
            return (
                <DropdownProvider>
                    <PermissaoRow
                        stripped={index % 2 == 1}
                        data={dados}
                        acoesSelecionadas={acoesSelecionadas} // ✅ Agora é global
                        handleSelectItem={handleSelectItem} // ✅ Função global para seleção
                    />
                </DropdownProvider>
            );
        };

        const content = useTableContent<PermissaoResponseData>({
            isLoading,
            error,
            isError,
            data: data as PermissaoResponseData[],
            errorMessage: "Erro ao carregar permissões com itens a pedir!",
            contentFunction: contentFunction,
            beforeContent: () => <PermissaoHeader />,
        });
        return (
            <>
                {/* Modal de autorização fora das permissões */}
                <GerarAutorizacaoModal
                    hide={hideGerarAutorizacaoModal}
                    setHide={setHideGerarAutorizacaoModal}
                    acoesIds={acoesSelecionadas.map((acao) => acao.id)}
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
                                backgroundColor: acoesSelecionadas.length > 0 ? "#007bff" : "#ccc",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: acoesSelecionadas.length > 0 ? "pointer" : "not-allowed"
                            }}
                        >
                            Gerar Autorização ({acoesSelecionadas.length} selecionadas)
                        </button>
                    </div>
                    {content}
                </TableContainer>
            </>
        );
    }
);
export default AutorizacaoTable;

