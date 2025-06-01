import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useDropdown from "../../../../../../hooks/useDropdown.ts";
import ListaAcoesRow from "../ListaAcoesRow";
import ListaAcoesHeader from "../../headers/ListaAcoesHeader";
import AutorizacaoResponseData from "../../../../../../models/administracao/AutorizacaoResponseData.ts";
import ListaAcaoAutorizacaoResponseData
    from "../../../../../../models/administracao/ListaAcaoAutorizacaoResponseData.ts";


/**
 * Linha de exibição de pedidos
 */
interface AutorizacaoRowProps {
    data: AutorizacaoResponseData;
    stripped: boolean;
    acoesSelecionadas: ListaAcaoAutorizacaoResponseData[]; // ✅ Agora vem do pai
    handleSelectItem: (acao: ListaAcaoAutorizacaoResponseData) => void; // ✅ Agora vem do pai
}

const AutorizacaoRow = memo(function AutorizacaoRow({ data, stripped, acoesSelecionadas, handleSelectItem }: AutorizacaoRowProps) {
    const { refresh } = useView();
    const { rowRefresh } = useDropdown();
    const { toggleRequest, data: requestData, isLoading, error, isError } =
        useFetch<ListaAcaoAutorizacaoResponseData>(useEndpoint().administacao().GET().listarAutorizacoesAcoes(data.id));

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [refresh, toggleRequest, isDropdownOpen, rowRefresh]);

    const contentFunction = (dados: ListaAcaoAutorizacaoResponseData, index: number) => {
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
        data: requestData as ListaAcaoAutorizacaoResponseData[],
        errorMessage: "Erro ao carregar itens a pedir.",
        contentFunction: contentFunction,
        beforeContent: () => <ListaAcoesHeader />,
    });

    return (
        <>
            <TableRow stripped={stripped} dropdown={true} content={dropdownContent}
                      onClick={() => setIsDropdownOpen((prev) => !prev)}>
                <RowPiece size={1}>
                    {data.id}
                </RowPiece>
                <RowPiece size={1}>
                    {data.nome}
                </RowPiece>
                <RowPiece size={1}>
                    {data.descricao}
                </RowPiece>
            </TableRow>
        </>
    );
});

export default AutorizacaoRow;
