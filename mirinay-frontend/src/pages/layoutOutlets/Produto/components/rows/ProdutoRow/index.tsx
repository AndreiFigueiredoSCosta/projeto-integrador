import {memo, useCallback, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import {useNavigate} from "react-router-dom";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import DropdownOptionsHeader from "../../../../../../components/table/DropdownOptionsHeader";
import SimilarRow from "../SimilarRow/index.tsx";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import SimilarHeader from "../../headers/SimilarHeader";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import SimilarResponseData from "../../../../../../models/produto/response/SimilarResponseData.ts";
import ProdutoResponseData from "../../../../../../models/produto/response/ProdutoResponseData.ts";
import idConversor from "../../../../../../utils/idConversor.ts";
import useView from "../../../../../../hooks/useView.ts";

interface ProdutoRowProps {
    data: ProdutoResponseData,
    stripped: boolean
    handleInsert: (info: ProdutoResponseData) => void
}

/**
 * Linha de exibição de Produto
 */
const ProdutoRow = memo(
    function ProdutoRow ({ data, stripped, handleInsert } : ProdutoRowProps){
    const navigate = useNavigate();
    const { refresh } = useView();
    const { toggleRequest, error, data: requestData, isError, isLoading} =
        useFetch<SimilarResponseData>(useEndpoint().produto().informacoes(data.id).similares);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

    // Click handling
    const handleClick = useCallback((type: string) =>{
        switch (type){
            case 'insert':
                handleInsert(data);
                break;
            case 'details':
                navigate(`/produto/detalhes/${data.id}`);
                break;
        }
    }, [handleInsert, data, navigate]);

    const contentFunction = (dados: SimilarResponseData, index: number) => {
        return (
            <SimilarRow data={dados} stripped={index % 2 == 1} />
        );
    }

    const beforeContent = () => {
        return (
            <>
                <DropdownOptionsHeader
                    onDetailsClick={() => handleClick('details')}
                    onInsertClick={() => handleClick('insert')}/>
                <SimilarHeader />
            </>
        );
    }

    const dropdownContent = useTableContent<SimilarResponseData>({
        isLoading: isLoading,
        error,
        isError: isError,
        data: requestData as SimilarResponseData[],
        errorMessage: "Erro ao carregar os similares",
        contentFunction: contentFunction,
        beforeContent: beforeContent,
        limited: false
    })

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [isDropdownOpen, toggleRequest, refresh]);

    return (
        <TableRow stripped={stripped}
                  dropdown={true}
                  content={dropdownContent}
                  onClick={() => setIsDropdownOpen((prevState) => !prevState)}>
            <RowPiece size={4}>
                {idConversor(data.id)} - {data.nome}
            </RowPiece>

        </TableRow>
    );

});

export default ProdutoRow;

