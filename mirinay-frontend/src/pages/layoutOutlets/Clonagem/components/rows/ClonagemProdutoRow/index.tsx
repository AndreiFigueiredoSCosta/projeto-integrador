import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../components/misc/IconButton";
import DeleteModal from "../../../../../../components/modals/DeleteModal";
import ClonagemProdutoResponseData from "../../../../../../models/clonagem/response/ClonagemProdutoResponseData.ts";
import ClonagemSimilarHeader from "../../headers/ClonagemSimilarHeader";
import ClonagemSimilarResponseData from "../../../../../../models/clonagem/response/ClonagemSimilarResponseData.ts";
import ClonagemSimilarRow from "../ClonagemSimilarRow";
import ClonagemResponseData from "../../../../../../models/clonagem/response/ClonagemResponseData.ts";
import idConversor from "../../../../../../utils/idConversor.ts";

interface ClonagemRowProps {
    data: ClonagemProdutoResponseData,
    clonagemData: ClonagemResponseData,
    stripped: boolean
    handleDelete: () => void
}

/**
 * Linha de exibição de item de um produto de uma clonagem
 */
const ClonagemProdutoRow = memo(
    function ClonagemProdutoRow ({
                                     data,
                                     clonagemData,
                                     stripped,
                                     handleDelete }
                                     : ClonagemRowProps){
    const [ nomeDelete, setNomeDelete ] = useState<string>("");
    const [ deleteId, setDeleteId ] = useState<number>(-1);
    const [ hideDelete, setHideDelete ] = useState<boolean>(true);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState<boolean>(false);
    const [ refreshDropdown, setRefreshDropdown ] = useState<boolean>(false);
    const { data: requestData, isError, error, toggleRequest, isLoading } = useFetch<ClonagemSimilarResponseData>(useEndpoint().clonagem(clonagemData.clonagemId).item().todos().similar(data.produtoId));

    const beforeContent =
        () =>{
        return (
            <ClonagemSimilarHeader />
        );
    }

    const handleSimilarDelete = (deleteId: number, nome: string) => {
        setDeleteId(deleteId);
        setNomeDelete(nome);
        setHideDelete(false);
    }

    const contentFunction = (dados: ClonagemSimilarResponseData, index: number) => {
        return (
            <ClonagemSimilarRow
                data={dados}
                stripped={index%2 === 0}
                handleDelete={() => handleSimilarDelete(dados.similarId, dados.referencia)}
            />
        );
    }

    const dropdownContent =
        useTableContent<ClonagemSimilarResponseData>({
            isLoading,
            error,
            isError,
            limited: false,
            data: requestData as ClonagemSimilarResponseData[],
            errorMessage: "Erro ao carregar similares do produto",
            contentFunction: contentFunction,
            beforeContent: beforeContent
        });

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [isDropdownOpen, refreshDropdown]);

    return (
        <>
            <DeleteModal hide={hideDelete}
                         setHide={setHideDelete}
                         request={`${useEndpoint().clonagem(clonagemData.clonagemId).item().deletar(deleteId).similar}`}
                         errorMessage={"Erro ao deletar referência!"}
                         successMessage={"Referência deletada com sucesso!"}
                         onDelete={() =>{
                                    setNomeDelete("");
                                    setDeleteId(-1);
                                    setTimeout(() => {
                                        return setRefreshDropdown((prev) => !prev);
                                        }, 0);
                                }}
            >
                Tem certeza que deseja deletar a referência {nomeDelete} do produto {data.produtoId} da clonagem {clonagemData.nome}?
            </DeleteModal>

            <TableRow stripped={stripped}
                      dropdown={true}
                      content={dropdownContent}
                      onClick={() => {
                          setTimeout(() => {
                              return setIsDropdownOpen((prev) => !prev);
                          }, 0);
                      }}>
                <RowPiece size={10}>
                    {idConversor(data.produtoId)} - {data.produtoNome}
                </RowPiece>
                <RowPiece size={1}>
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}>
                        <IconButton
                            variant="delete"
                            onClick={handleDelete}
                            size={"small"}
                        />
                    </div>
                </RowPiece>
            </TableRow>
        </>
    );
});

export default ClonagemProdutoRow;

