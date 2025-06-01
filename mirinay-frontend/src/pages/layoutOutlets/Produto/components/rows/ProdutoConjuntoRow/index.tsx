import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import ProdutoResponseData from "../../../../../../models/produto/response/ProdutoResponseData.ts";
import idConversor from "../../../../../../utils/idConversor.ts";
import ProdutoComponenteRow from "../ProdutoComponenteRow";
import ProdutoHeader from "../../headers/ProdutoHeader";
import IconButton from "../../../../../../components/misc/IconButton";

interface ProdutoRowProps {
    data: ProdutoResponseData,
    stripped: boolean,
    deleteFunction?: () => void
}

/**
 * Linha de exibição de Produto
 */
const ProdutoConjuntoRow = memo(
    function ProdutoConjuntoRow ({ data, stripped, deleteFunction = () => {} } : ProdutoRowProps){
    const { toggleRequest, error, data: requestData, isError, isLoading} =
        useFetch<ProdutoResponseData>(useEndpoint().produto().informacoes(data.id).componentes);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

    const contentFunction = (dados: ProdutoResponseData, index: number) => {
        return (
            <ProdutoComponenteRow data={dados} stripped={index % 2 == 1} />
        );
    }

    const dropdownContent = useTableContent<ProdutoResponseData>({
        isLoading: isLoading,
        error,
        isError: isError,
        data: requestData as ProdutoResponseData[],
        errorMessage: "Erro ao carregar os similares",
        contentFunction: contentFunction,
        beforeContent: () => <ProdutoHeader />,
        limited: false
    })

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [isDropdownOpen, toggleRequest]);

    return (
        <TableRow stripped={stripped}
                  dropdown={true}
                  content={dropdownContent}
                  onClick={() => setIsDropdownOpen((prevState) => !prevState)}
        >
            <RowPiece size={10}>
                {idConversor(data.id)} - {data.nome}
            </RowPiece>
            <RowPiece size={2}>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <IconButton variant={"delete"} size={"small"} onClick={deleteFunction} />
                </div>
            </RowPiece>
        </TableRow>
    );

});

export default ProdutoConjuntoRow;

