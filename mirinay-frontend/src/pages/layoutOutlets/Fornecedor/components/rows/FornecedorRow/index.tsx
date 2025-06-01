import {memo, useCallback, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import {useNavigate} from "react-router-dom";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import DropdownOptionsHeader from "../../../../../../components/table/DropdownOptionsHeader";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import idConversor from "../../../../../../utils/idConversor.ts";
import FornecedorCNPJHeader from "../../headers/FornecedorCNPJHeader";
import FornecedorCNPJRow from "../FornecedorCNPJRow/index.tsx";
import FornecedorResponseData from "../../../../../../models/fornecedor/response/FornecedorResponseData.ts";
import FornecedorCNPJResponseData from "../../../../../../models/fornecedor/response/FornecedorCNPJResponseData.ts";
import useView from "../../../../../../hooks/useView.ts";

interface ProdutoRowProps {
    data: FornecedorResponseData,
    stripped: boolean
    handleInsert: (info: FornecedorResponseData) => void
}

/**
 * Linha de exibição de Produto
 */

const FornecedorRow = memo(
    function FornecedorRow ({ data, stripped, handleInsert } : ProdutoRowProps){
    const navigate = useNavigate();
    const { toggleRequest, error, data: requestData, isError, isLoading} =
        useFetch<FornecedorCNPJResponseData>(useEndpoint().fornecedor().informacoes(data.id).cnpjs);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const [formattedData, setFormattedData] = useState<FornecedorCNPJResponseData[]>([]);
    const { refresh } = useView();

    useEffect(() => {
        if (isDropdownOpen) {
            const toFormat: FornecedorCNPJResponseData[] = requestData as FornecedorCNPJResponseData[];

            const popped = toFormat.filter((item) => item.tipo == 'MATRIZ');
            const filtered = toFormat.filter((item) => item.tipo != 'MATRIZ');
            return setFormattedData(popped.concat(filtered));
        }
    }, [requestData]);

    // Click handling
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

    const contentFunction = (dados: FornecedorCNPJResponseData, index: number) => {
        return (
            <FornecedorCNPJRow data={dados} stripped={index % 2 == 1} />
        );
    }

    const dropdownContent = useTableContent<FornecedorCNPJResponseData>({
        isLoading: isLoading,
        error,
        isError: isError,
        data: formattedData,
        errorMessage: "Erro ao carregar os CNPJs",
        contentFunction: contentFunction,
        beforeContent: () => {
            return (
                <>
                    <DropdownOptionsHeader
                        onDetailsClick={() => handleClick('details')}
                        onInsertClick={() => handleClick('insert')}/>
                    <FornecedorCNPJHeader />
                </>);
        },
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

export default FornecedorRow;

