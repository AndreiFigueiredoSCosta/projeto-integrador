import {memo, useCallback, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useDropdown from "../../../../../../hooks/useDropdown.ts";
import AutorizacaoResponseData from "../../../../../../models/administracao/AutorizacaoResponseData.ts";
import ListaUsuariosHeader from "../../headers/ListaUsuariosHeader";
import ListaUsuariosRow from "../ListaUsuariosRow";
import UsuarioResponseData from "../../../../../../models/administracao/UsuarioResponseData.ts";
import DropdownOptionsHeader from "../../../../../../components/table/DropdownOptionsHeader";
import {useNavigate} from "react-router-dom";


/**
 * Linha de exibição de pedidos
 */
interface AutorizacaoUsuariosRowProps {
    data: AutorizacaoResponseData;
    stripped: boolean;
    handleInsert: (info: AutorizacaoResponseData) => void

}

const AutorizacaoUsuariosRow = memo(function AutorizacaoUsuariosRow({ data, stripped, handleInsert }: AutorizacaoUsuariosRowProps) {
    const { refresh } = useView();
    const { rowRefresh } = useDropdown();
    const { toggleRequest, data: requestData, isLoading, error, isError } =
        useFetch<UsuarioResponseData>(useEndpoint().administacao().GET().usuarios(data.id));

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [refresh, toggleRequest, isDropdownOpen, rowRefresh]);

    const contentFunction = (dados: UsuarioResponseData, index: number) => {
        return (
            <ListaUsuariosRow
                data={dados}
                stripped={index % 2 === 1}

            />
        );
    };
    const handleClick = useCallback((type: string) =>{
        switch (type){
            case 'insert':
                handleInsert(data);
                break;
            case 'details':
                navigate(`/fornecedor/detalhes/${data.id}`);
                break;
        }
    }, [handleInsert, data, navigate]);

    const dropdownContent = useTableContent<UsuarioResponseData>({
        isLoading,
        error,
        isError,
        limited: false,
        data: requestData as UsuarioResponseData[],
        errorMessage: "Erro ao carregar usuario.",
        contentFunction: contentFunction,
        beforeContent: () => {
            return (
            <>
                <DropdownOptionsHeader
                    onDetailsClick={() => handleClick('details')}
                    onInsertClick={() => handleClick('insert')}/>
                <ListaUsuariosHeader />
            </>);
        },

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

export default AutorizacaoUsuariosRow;
