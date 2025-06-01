import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import SubgrupoResponseData from "../../../../../../models/grupo/response/SubgrupoResponseData.ts";
import ProdutoResponseData from "../../../../../../models/produto/response/ProdutoResponseData.ts";
import ProdutoRow from "../ProdutoRow/index.tsx";
import idConversor from "../../../../../../utils/idConversor.ts";
import ProdutoHeader from "../../headers/ProdutoHeader";
import useView from "../../../../../../hooks/useView.ts";


interface SubGrupoProdRowProps {
    data: SubgrupoResponseData,
    stripped: boolean
    handleInsert: (info: ProdutoResponseData) => void
}

/**
 * Linha de exibição de Produto
 */
const SubGrupoProdRow = memo(
    function SubGrupoProdRow ({ data, stripped, handleInsert } : SubGrupoProdRowProps){
    const { toggleRequest, error, isError, isLoading, data: requestData} =
        useFetch<ProdutoResponseData>(useEndpoint().subgrupo().informacoes(data.subgrupoId).produtos);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const { refresh } = useView();

    const contentFunction = (dados: ProdutoResponseData, index: number) => {
        return (
            <ProdutoRow data={dados} stripped={index % 2 == 1} handleInsert={handleInsert} />
        );
    }

    const dropdownContent = useTableContent({
        isLoading,
        error,
        isError,
        data: requestData as ProdutoResponseData[],
        errorMessage: "Erro ao carregar produtos",
        contentFunction: contentFunction,
        beforeContent: () => <ProdutoHeader />,
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
                {idConversor(data.subgrupoId)} - {data.nome}
            </RowPiece>

        </TableRow>
    );
});

export default SubGrupoProdRow;

