import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../components/misc/IconButton";
import idConversor from "../../../../../../utils/idConversor.ts";
import MatrizFilialEnum from "../../../../../../enums/MatrizFilialEnum.ts";
import {ActionButton} from "../../../../../../components/buttons/action/ActionButton";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useErrorHandling} from "../../../../../../hooks/useErrorHandling.ts";
import useToastManager from "../../../../../../hooks/useToastManager.ts";
import {Loading} from "../../../../../../components/misc/Loading";
import {useEffect} from "react";
import useView from "../../../../../../hooks/useView.ts";
import FornecedorCNPJResponseData from "../../../../../../models/fornecedor/response/FornecedorCNPJResponseData.ts";

interface SimilarRowProps {
    data: FornecedorCNPJResponseData;
    stripped: boolean;
    deleteFunction: (data: FornecedorCNPJResponseData) => void;
    editFunction: (data: FornecedorCNPJResponseData) => void;
}

/**
 * Linha de exibição de similares
 * @constructor
 */
export default function FornecedorCNPJDetailsRow({ data, stripped, editFunction, deleteFunction } : SimilarRowProps){
    const { execute, isSuccess, isLoading, isError, error } = useMutate(useEndpoint().fornecedorCNPJ().operacoes(data.id).alterarTipo);
    const matriz = data.tipo == MatrizFilialEnum.MATRIZ;
    const { refreshView } = useView();
    const { success } = useToastManager()

    useEffect(() => {
        if (isSuccess) {
            success("Tipo do CNPJ alterado com sucesso", `O CNPJ ${data.nome} agora é uma matriz`);
            refreshView();
        }
    }, [isSuccess]);

    useErrorHandling(isError, error, "Erro ao alterar tipo do CNPJ");

    return (
        <TableRow stripped={stripped} selected={matriz}>
            <RowPiece size={2} textSize={"small"}  selected={matriz}>
                {idConversor(data.id)} - {data.nome}
            </RowPiece>
            <RowPiece size={2} textSize={"small"}  selected={matriz}>
                {data.cnpj}
            </RowPiece>
            <RowPiece size={2} textSize={"small"}  selected={matriz}>
                {data.cidade} - {data.estado}
            </RowPiece>
            <RowPiece size={2} textSize={"small"} selected={matriz}>
                {data.telefone} <br/>
                {data.email}
            </RowPiece>
            <RowPiece size={2} textSize={"small"} selected={matriz}>
                {
                    !matriz &&
                    <ActionButton
                        variant={"details"}
                        size={"small"}
                        onClick={() => {
                            execute({});
                        }}
                        disabled={isLoading}
                    >
                        {
                            !isLoading ?
                                <>Tornar</>
                            :
                                <Loading/>
                        }
                    </ActionButton>
                }
            </RowPiece>
            <RowPiece size={1} selected={matriz}>
                <div style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "end",
                    gap: "10px"
                }}>
                    <IconButton
                        variant={"edit"}
                        onClick={() => {
                            editFunction(data);
                        }}
                        size={"small"}
                        selected={matriz} />
                    <IconButton
                        variant={"delete"}
                        onClick={() => {
                            deleteFunction(data);
                        }}
                        size={"small"}
                        selected={matriz}
                    />
                </div>
            </RowPiece>
        </TableRow>
    );
}
