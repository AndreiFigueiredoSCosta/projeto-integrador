import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useDropdown from "../../../../../../hooks/useDropdown.ts";
import PermissaoResponseData from "../../../../../../models/administracao/PermissaoResponseData.ts";
import ListaAcaoResponseData from "../../../../../../models/administracao/ListaAcaoResponseData.ts";
import ListaAcoesRow from "../ListaAcoesRow";
import ListaAcoesHeader from "../../headers/ListaAcoesHeader";
import GerarAutorizacaoModal from "../../../summary/modals/GerarAutorizacaoModal";

interface PermissaoRowProps {
    data: PermissaoResponseData,
    stripped: boolean
}

/**
 * Linha de exibição de pedidos
 */
interface PermissaoRowProps {
    data: PermissaoResponseData;
    stripped: boolean;
    acoesSelecionadas: ListaAcaoResponseData[]; // ✅ Agora vem do pai
    handleSelectItem: (acao: ListaAcaoResponseData) => void; // ✅ Agora vem do pai
}

const PermissaoRow = memo(function PermissaoRow({ data, stripped, acoesSelecionadas, handleSelectItem }: PermissaoRowProps) {
    const { refresh } = useView();
    const { rowRefresh } = useDropdown();
    const { toggleRequest, data: requestData, isLoading, error, isError } =
        useFetch<ListaAcaoResponseData>(useEndpoint().administacao().GET().listarAcoes(data.id));

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [hideGerarAutorizacaoModal, setHideGerarAutorizacaoModal] = useState<boolean>(true);

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [refresh, toggleRequest, isDropdownOpen, rowRefresh]);

    const contentFunction = (dados: ListaAcaoResponseData, index: number) => {
        return (
            <ListaAcoesRow
                data={dados}
                stripped={index % 2 === 1}
                handleSelect={handleSelectItem} // ✅ Agora a seleção funciona globalmente
                selectedItens={acoesSelecionadas.map((acao) => acao.id)}
            />
        );
    };

    const dropdownContent = useTableContent({
        isLoading,
        error,
        isError,
        limited: false,
        data: requestData as ListaAcaoResponseData[],
        errorMessage: "Erro ao carregar itens a pedir.",
        contentFunction: contentFunction,
        beforeContent: () => <ListaAcoesHeader />,
    });

    return (
        <>
            <GerarAutorizacaoModal
                hide={hideGerarAutorizacaoModal}
                setHide={setHideGerarAutorizacaoModal}
                acoesIds={acoesSelecionadas.map((acoes) => acoes.id)}
            />
            <TableRow stripped={stripped} dropdown={true} content={dropdownContent}
                      onClick={() => setIsDropdownOpen((prev) => !prev)}>
                <RowPiece size={1}>
                    {data.id} - {data.nome}
                </RowPiece>
            </TableRow>
        </>
    );
});

export default PermissaoRow;
