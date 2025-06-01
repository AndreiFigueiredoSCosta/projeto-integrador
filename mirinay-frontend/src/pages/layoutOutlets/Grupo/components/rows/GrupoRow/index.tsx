import SubgrupoResponseData from "../../../../../../models/grupo/response/SubgrupoResponseData.ts";
import {memo, useCallback, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import {useNavigate} from "react-router-dom";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import DropdownOptionsHeader from "../../../../../../components/table/DropdownOptionsHeader";
import SubgrupoRow from "../SubgrupoRow";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import SubgrupoHeader from "../../headers/SubgrupoHeader";
import GrupoResponseData from "../../../../../../models/grupo/response/GrupoResponseData.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import idConversor from "../../../../../../utils/idConversor.ts";
import useView from "../../../../../../hooks/useView.ts";

interface GrupoRowProps {
    data: GrupoResponseData,
    stripped: boolean
    handleInsert: (info: GrupoResponseData) => void
}

//Dados para teste sem a API
// const dataTeste: SubgrupoResponseData[] = [
//     {
//         unidadeId: 1,
//         nome: "Grupo 1",
//         alerta: "Descrição 1"
//     },
//     {
//         unidadeId: 2,
//         nome: "Grupo 2",
//         alerta: "Descrição 2"
//     },
//     {
//         unidadeId: 3,
//         nome: "Grupo 3",
//         alerta: "Descrição 3"
//     }
// ];

/**
 * Linha de exibição de grupo
 */
const GrupoRow = memo( function GrupoRow ({ data, stripped, handleInsert } : GrupoRowProps){
    const navigate = useNavigate();
    const { refresh } = useView();
    const [ isDropdownOpen, setIsDropdownOpen ] = useState<boolean>(false)
    const { toggleRequest, data: requestData, isLoading, error, isError} =
        useFetch<SubgrupoResponseData>(useEndpoint().grupo().informacoes(data.codigo).subgrupos);

    // Click handling
    const handleClick = useCallback((type: string) =>{
        switch (type){
            case 'insert':
                handleInsert(data);
                break;
            case 'details':
                navigate(`/grupo/detalhes/${data.codigo}`);
                break;
        }
    }, [handleInsert, data, navigate]);

    const contentFunction =
        (dados: SubgrupoResponseData, index: number)=> {
        return (
            <SubgrupoRow data={dados} stripped={index % 2 == 1} />
        );
    }

    const beforeContent =
        () =>{
        return (
            <>
                <DropdownOptionsHeader
                    onDetailsClick={() => handleClick('details')}
                    onInsertClick={() => handleClick('insert')}/>
                <SubgrupoHeader />
            </>
        );
    }

    const dropdownContent = useTableContent({
        isLoading,
        error,
        isError,
        limited: false,
        data: requestData as SubgrupoResponseData[],
        errorMessage: "Erro ao carregar subgrupos",
        contentFunction: contentFunction,
        beforeContent: beforeContent
    })

    useEffect(() => {
        if (isDropdownOpen){
            toggleRequest();
        }
    }, [isDropdownOpen, toggleRequest, refresh]);

    return (
        <TableRow stripped={stripped}
                  dropdown={true}
                  content={dropdownContent}
                  onClick={() => setIsDropdownOpen((prevState) => {
                      return !prevState;
                  })}
        >
            <RowPiece size={4}>
                {idConversor(data.codigo)} - {data.nome}
            </RowPiece>
            <RowPiece size={8}>
                {data.descricao}
            </RowPiece>
        </TableRow>
    );
});

export default GrupoRow;

