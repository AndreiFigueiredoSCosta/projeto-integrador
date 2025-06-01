import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import SimilarRow from "../SimilarRow/index.tsx";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import SimilarResponseData from "../../../../../../models/produto/response/SimilarResponseData.ts";
import ProdutoResponseData from "../../../../../../models/produto/response/ProdutoResponseData.ts";
import idConversor from "../../../../../../utils/idConversor.ts";
import IconButton from "../../../../../../components/misc/IconButton";
import SimilarHeader from "../../headers/SimilarHeader";

interface ProdutoRowProps {
    data: ProdutoResponseData,
    stripped: boolean,
    hasDelete?: boolean,
    deleteFunction?: () => void
}

/**
 * Linha de exibição de Produto
 */
const ProdutoComponenteRow = memo(
    function ProdutoComponenteRow ({ data, stripped, hasDelete = false, deleteFunction = () => {}} : ProdutoRowProps){
    const produtoId = useParams().produtoId as unknown as number;
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const { toggleRequest, error, data: requestData, isError, isLoading} =
        useFetch<SimilarResponseData>(useEndpoint().produto().informacoes(data.id).similares);


    const contentFunction = (dados: SimilarResponseData, index: number) => {
        return (
            <SimilarRow data={dados} stripped={index % 2 == 1} />
        );
    }

    const dropdownContent = useTableContent<SimilarResponseData>({
        isLoading: isLoading,
        error,
        isError: isError,
        data: requestData as SimilarResponseData[],
        errorMessage: "Erro ao carregar os similares",
        contentFunction: contentFunction,
        beforeContent: () => <SimilarHeader />,
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
                  selected={produtoId == data.id}
        >
            <RowPiece size={10}>
                {idConversor(data.id)} - {data.nome}
            </RowPiece>
            {
                hasDelete &&
                <RowPiece size={2}>
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <IconButton variant={"delete"} size={"small"} selected={isDropdownOpen} onClick={deleteFunction} />
                    </div>
                </RowPiece>
            }
        </TableRow>
    );

});

export default ProdutoComponenteRow;

