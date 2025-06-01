
import {useParams} from "react-router-dom";
import CotacaoRevisaoProdutoSimilarResponseData
    from "../../../../../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoSimilarResponseData.ts";
import {TableRow} from "../../../../../../../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../../../../../../../components/table/components/RowPiece";
import {ActionButton} from "../../../../../../../../../../../../components/buttons/action/ActionButton";
import {P} from "../../../../../../../../../../../../components/text/P";
import {useMutate} from "../../../../../../../../../../../../hooks/useMutate.ts";
import useEndpoint from "../../../../../../../../../../../../hooks/useEndpoint.ts";
import {useErrorHandling} from "../../../../../../../../../../../../hooks/useErrorHandling.ts";
import {useEffect, useState} from "react";
import useToastManager from "../../../../../../../../../../../../hooks/useToastManager.ts";
import ConfirmModal from "../../../../../../../../../../../../components/modals/ConfirmModal";
import useDropdown from "../../../../../../../../../../../../hooks/useDropdown.ts";

interface ClonagemFornecedorRowProps {
    data: CotacaoRevisaoProdutoSimilarResponseData;
    itemId: number;
    stripped: boolean;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoProdutoSimilarRow({
                                                     itemId,
                                                     data,
                                                     stripped}
                                                     : ClonagemFornecedorRowProps){
    const id = useParams().requisicaoId as unknown as number;
    const { refreshDropdown } = useDropdown();
    const endpoint = useEndpoint().cotacao().PATCH().revisao(id).item(itemId).selecionarSimilar
    const { execute, error, isError, isSuccess, isLoading } = useMutate(endpoint, {
        method: "PATCH"
    });
    const { success } = useToastManager();
    const [ hideConfirm, setHideConfirm ] = useState(true);

    useEffect(() => {
        if(isSuccess){
            success("Similar selecionado com sucesso.");
            refreshDropdown();
        }
    }, [isSuccess]);

    useErrorHandling(isError, error, "Erro ao selecionar item.");

    return (
        <>
            <ConfirmModal
                hide={hideConfirm}
                setHide={setHideConfirm}
                title={"Deseja realmente alterar o similar desse item?"}
                onConfirm={() => {
                    execute({similarId: data.similarId});
                    setHideConfirm(true);
                }}
                confirmBtnText={"Selecionar"}
                isLoading={isLoading}
            >
                Deseja realmente alterar o similar desse item para {data.referencia}?
            </ConfirmModal>
            <TableRow
                stripped={stripped} approved={data.selecionado}
            >
                <RowPiece size={3}>
                    {data.referencia}
                </RowPiece>
                <RowPiece size={3}>
                    {data.marca}
                </RowPiece>
                <RowPiece size={4} textSize={"small"}>
                    {data.observacao}
                </RowPiece>
                <RowPiece size={2}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px"
                    }}>
                        {
                            data.selecionado ?
                                <P
                                    bold={true}
                                    align={"middle"}
                                    justify={"center"}
                                    variant={"large"}
                                    color={"green"}
                                    uppercase={true}
                                >
                                    Selecionado
                                </P>
                                :
                                <ActionButton
                                    variant={"details"}
                                    onClick={() => setHideConfirm(false)}
                                    size={"small"}
                                    hasLoading={isLoading}
                                >
                                    Selecionar
                                </ActionButton>
                        }
                    </div>
                </RowPiece>
            </TableRow>
        </>
    );
}
