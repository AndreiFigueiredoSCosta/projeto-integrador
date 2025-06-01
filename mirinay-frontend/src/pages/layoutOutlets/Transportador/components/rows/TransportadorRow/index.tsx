import {memo, useCallback, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import {useNavigate} from "react-router-dom";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import DropdownOptionsHeader from "../../../../../../components/table/DropdownOptionsHeader";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import idConversor from "../../../../../../utils/idConversor.ts";
import TransportadorFilialRow from "../TransportadorFilialRow/index.tsx";
import TransportadorFilialHeader from "../../headers/TransportadorFilialHeader";
import TransportadorResponseData from "../../../../../../models/transportador/response/TransportadorResponseData.ts";
import TransportadorCnpjResponseData
    from "../../../../../../models/transportador/response/TransportadorCnpjResponseData.ts";
import useView from "../../../../../../hooks/useView.ts";

interface ProdutoRowProps {
    data: TransportadorResponseData,
    stripped: boolean
    handleInsert: (info: TransportadorResponseData) => void
}

/**
 * Linha de exibição de Produto
 */
const TransportadorRow = memo(
    function TransportadorRow ({ data, stripped, handleInsert } : ProdutoRowProps){
    const navigate = useNavigate();
    const { toggleRequest, error, data: requestData, isError, isLoading} =
        useFetch<TransportadorCnpjResponseData>(useEndpoint().transportador().informacoes(data.id).cnpjs);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const [formattedData, setFormattedData] = useState<TransportadorCnpjResponseData[]>([]);
    const { refresh } = useView();

    useEffect(() => {
        if (isDropdownOpen) {
            const toFormat: TransportadorCnpjResponseData[] = requestData as TransportadorCnpjResponseData[];

            const popped = toFormat.filter((item) => item.tipo == 'MATRIZ');
            const filtered = toFormat.filter((item) => item.tipo != 'MATRIZ');
            setFormattedData(popped.concat(filtered));
        }
    }, [requestData]);

    // Click handling
    const handleClick = useCallback((type: string) =>{
        switch (type){
            case 'insert':
                handleInsert(data);
                break;
            case 'details':
                navigate(`/transportador/detalhes/${data.id}`);
                break;
        }
    }, [handleInsert, data, navigate]);

    const contentFunction = (dados: TransportadorCnpjResponseData, index: number) => {
        return (
            <TransportadorFilialRow data={dados} stripped={index % 2 == 1} />
        );
    }

    const dropdownContent = useTableContent<TransportadorCnpjResponseData>({
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
                    <TransportadorFilialHeader />
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

export default TransportadorRow;

