import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import GrupoResponseData from "../../../../../../models/grupo/response/GrupoResponseData.ts";
import SubgrupoResponseData from "../../../../../../models/grupo/response/SubgrupoResponseData.ts";
import SubGrupoProdRow from "../SubGrupoProdRow/index.tsx";
import ProdutoResponseData from "../../../../../../models/produto/response/ProdutoResponseData.ts";
import idConversor from "../../../../../../utils/idConversor.ts";
import ProdutoSubgrupoHeader from "../../headers/ProdutoSubgrupoHeader";


interface GrupoProdRowProps {
    data: GrupoResponseData,
    stripped: boolean
    handleInsert: (info: ProdutoResponseData) => void
}

// const testeData2: SubgrupoResponseData[] = [
//
//     {
//         unidadeId: 1,
//         nome: "Subgrupo1",
//         alerta: "teste1"
//     },
//     {
//         unidadeId: 2,
//         nome: "Subgrupo2",
//         alerta: "teste2"
//     },
//
// ]

/**
 * Linha de exibição de Produto
 */
const GrupoProdRow = memo( function GrupoProdRow ({ data, stripped, handleInsert } : GrupoProdRowProps){
    const { toggleRequest, error, data: requestData, isError, isLoading} =
        useFetch<SubgrupoResponseData>(useEndpoint().grupo().informacoes(data.codigo).subgrupos);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

    const contentFunction = (dados: SubgrupoResponseData, index: number) => {
        return (
            <SubGrupoProdRow data={dados} stripped={index % 2 == 1} handleInsert={handleInsert} />
        );
    }

    const dropdownContent = useTableContent<SubgrupoResponseData>({
        isLoading,
        error,
        isError,
        data: requestData as SubgrupoResponseData[],
        errorMessage: "Erro ao carregar subgrupos",
        contentFunction: contentFunction,
        beforeContent: () => <ProdutoSubgrupoHeader />,
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
                  onClick={() => setIsDropdownOpen((prevState) => !prevState)}>
            <RowPiece size={4}>
                {idConversor(data.codigo)} - {data.nome}
            </RowPiece>

        </TableRow>
    );

});

export default GrupoProdRow;

