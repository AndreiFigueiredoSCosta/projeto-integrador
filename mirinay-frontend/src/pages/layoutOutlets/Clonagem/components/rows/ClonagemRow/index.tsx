import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import ClonagemResponseData from "../../../../../../models/clonagem/response/ClonagemResponseData.ts";
import {BlankHeader} from "../../../../../../components/table/BlankHeader";
import {ActionButton} from "../../../../../../components/buttons/action/ActionButton";
import {InfoHeader} from "../../../../../../components/InfoHeader";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import idConversor from "../../../../../../utils/idConversor.ts";
import IconButton from "../../../../../../components/misc/IconButton";
import DeleteModal from "../../../../../../components/modals/DeleteModal";
import ClonagemProdutoHeader from "../../headers/ClonagemProdutoHeader";
import ClonagemFornecedorHeader from "../../headers/ClonagemFornecedorHeader";
import ClonagemProdutoRow from "../ClonagemProdutoRow";
import ClonagemFornecedorRow from "../ClonagemFornecedorRow";
import ClonagemFornecedorResponseData from "../../../../../../models/clonagem/response/ClonagemFornecedorResponseData.ts";
import ClonagemProdutoResponseData from "../../../../../../models/clonagem/response/ClonagemProdutoResponseData.ts";
import useView from "../../../../../../hooks/useView.ts";

interface ClonagemRowProps {
    data: ClonagemResponseData,
    stripped: boolean
    handleClick: (type: "delete" | "insert") => void
}

/**
 * Linha de exibição de clonagem
 */
const ClonagemRow = memo(
    function ClonagemRow ({
                              data,
                              stripped,
                              handleClick }
                              : ClonagemRowProps){
    const [ exibition, setExibition ] = useState<"similares" | "fornecedores">("similares");
    const [ nomeDelete, setNomeDelete ] = useState<string>("");
    const [ deleteId, setDeleteId ] = useState<number>(-1);
    const { refresh } = useView();
    const [ hideDelete, setHideDelete ] = useState<boolean>(true);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState<boolean>(false);
    const [ refreshDropdown, setRefreshDropdown ] = useState<boolean>(false);
    const fornecedorEndpoint = useEndpoint().clonagem(data.clonagemId).item().todos().fornecedor;
    const produtoEndpoint = useEndpoint().clonagem(data.clonagemId).item().todos().produto;
    const {
        data: fornecedorData,
        isError: isFornecedorError,
        error: fornecedorError,
        isLoading: isFornecedorLoading,
        toggleRequest: toggleFornecedorRequest } = useFetch<ClonagemFornecedorResponseData>(fornecedorEndpoint);
    const {
        data: produtoData,
        isError: isProdutoError,
        error: produtoError,
        isLoading: isProdutoLoading,
        toggleRequest:toggleProdutoRequest } = useFetch<ClonagemProdutoResponseData>(produtoEndpoint);

    const handleDelete = (deleteId: number, nome: string) => {
        setDeleteId(deleteId);
        setNomeDelete(nome);
        return setHideDelete(false);
    }

    const contentFunction =
        (dados: ClonagemFornecedorResponseData | ClonagemProdutoResponseData, index: number) => {
        if (exibition === "similares"){
            let typedData = dados as ClonagemProdutoResponseData;

            return (
                <ClonagemProdutoRow
                    data={typedData}
                    clonagemData={data}
                    stripped={index % 2 == 1}
                    handleDelete={() => {
                        return handleDelete(typedData.produtoId, typedData.produtoNome)
                    }}
                />
            );
        }
        else if (exibition === "fornecedores"){
            let typedData = dados as ClonagemFornecedorResponseData;

            return (
                <ClonagemFornecedorRow
                    data={typedData}
                    stripped={index % 2 == 1}
                    handleDelete={() => {
                        handleDelete(typedData.fornecedorId, typedData.fornecedorNome)
                    }}
                />
            );
        }
    }

    const AlternatingHeader = ({exibition} :{exibition: string}) => {
        if (exibition === "similares") {
            return <ClonagemProdutoHeader />
        }
        else {
            return <ClonagemFornecedorHeader />
        }
    }

    const beforeContent =
        () =>{
        return (
            <>
                <BlankHeader>
                    <div style={{
                        width: "100%",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <ActionButton
                            variant={"details"}
                            onClick={() => {
                                handleClick("insert")
                            }}
                            size={"small"}
                            style={{
                                maxWidth: "400px",
                            }}
                        >
                            Inserir
                        </ActionButton>
                    </div>
                </BlankHeader>
                <InfoHeader items={[
                    {
                        text: "Similares",
                        onChange: () => {
                            return setExibition("similares");
                        }},
                    {
                        text: "Fornecedores",
                        onChange: () => {
                            return setExibition("fornecedores");
                        }}
                ]} />
                <AlternatingHeader exibition={exibition} />
            </>
        );
    }

    const fornecedorContent =
        useTableContent<ClonagemFornecedorResponseData>({
            isLoading: isFornecedorLoading,
            error: fornecedorError,
            isError: isFornecedorError,
            limited: false,
            data: fornecedorData as ClonagemFornecedorResponseData[],
            errorMessage: "Erro ao carregar fornecedores da clonagem",
            contentFunction,
            beforeContent
        });

    const produtoContent =
        useTableContent<ClonagemProdutoResponseData>({
            isLoading: isProdutoLoading,
            error: produtoError,
            isError: isProdutoError,
            limited: false,
            data: produtoData as ClonagemProdutoResponseData[],
            errorMessage: "Erro ao carregar produtos da clonagem",
            contentFunction,
            beforeContent
        });

    const dropdownContent = exibition === "similares" ? produtoContent : fornecedorContent;

    // Garante que a request para a API seja feita apenas quando o dropdown é aberto para não sobrecarregar a API
    useEffect(() => {
        if (isDropdownOpen) {
            if (exibition === "similares") {
                toggleProdutoRequest();
            }
            else {
                toggleFornecedorRequest();
            }
        }
    }, [refresh, refreshDropdown, isDropdownOpen, toggleProdutoRequest, toggleFornecedorRequest, exibition]);

    return (
        <>
            <DeleteModal hide={hideDelete}
                         setHide={setHideDelete}
                         request={`${
                                    exibition === "similares" ?
                                    useEndpoint().clonagem(data.clonagemId).item().deletar(deleteId).produto
                                        :
                                    useEndpoint().clonagem(data.clonagemId).item().deletar(deleteId).fornecedor
                                }`}
                         errorMessage={"Erro ao deletar item!"}
                         successMessage={"Item deletado com sucesso!"}
                         onDelete={() =>{
                                    setNomeDelete("");
                                    setDeleteId(-1);
                                    setTimeout(() => {
                                        return setRefreshDropdown((prev) => !prev);
                                    }, 0);
                                }}
            >
                Tem certeza que deseja deletar o item {nomeDelete} da clonagem {data.nome}?
            </DeleteModal>

            <TableRow stripped={stripped}
                      dropdown={true}
                      content={dropdownContent}
                      onClick={() =>{
                          // setTimeout para evitar que o dropdown se comporte de forma estranha
                          setTimeout(() => {
                                return setIsDropdownOpen((prev) => !prev);
                            }, 0);
                      }}>
                <RowPiece size={10}>
                    {idConversor(data.clonagemId)} - {data.nome}
                </RowPiece>
                <RowPiece size={1}>
                    <div style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center"
                    }}>
                        <IconButton
                            variant="delete"
                            onClick={() => handleClick("delete")}
                            size={"small"}
                        />
                    </div>
                </RowPiece>
            </TableRow>
        </>
    );
});

export default ClonagemRow;

