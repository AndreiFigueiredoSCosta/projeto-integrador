import {memo, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import EfetuadosResponseData from "../../../../../../models/pedidos/EfetuadosResponseData.ts";
import idConversor from "../../../../../../utils/idConversor.ts";
import { StageBadge } from "../../../../../../components/misc/badges/default/StageBadge";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {ActionButton} from "../../../../../../components/buttons/action/ActionButton";
import formatToReais from "../../../../../../utils/formatToReais.ts";
import {BlankHeader} from "../../../../../../components/table/BlankHeader";
import DataTableColumn from "../../../../../../components/dataTable/DataTableColumn";
import DataTableRow from "../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../components/dataTable/DataTableCell";
import {useErrorHandling} from "../../../../../../hooks/useErrorHandling.ts";
import useView from "../../../../../../hooks/useView.ts";
import useToastManager from "../../../../../../hooks/useToastManager.ts";
import formatToDate from "../../../../../../utils/formatToDate.ts";

interface EfetuadosRowProps {
    data: EfetuadosResponseData,
    stripped: boolean
}

/**
 * Linha de exibição de Pedidos Efetuados
 */
const EfetuadosRow = memo( function EfetuadosRow ({ data, stripped } : EfetuadosRowProps){
    const navigate = useNavigate();
    const dropdownContent = (
            <>
                {/*<BlankHeader style={{*/}
                {/*    display: "flex",*/}
                {/*    flexDirection: "row",*/}
                {/*    alignItems: "center",*/}
                {/*    justifyContent: "center",*/}
                {/*}} >*/}
                {/*        <ActionButton*/}
                {/*            variant={"details"}*/}
                {/*            size={"small"}*/}
                {/*            onClick={() => navigate(`/pedido/detalhes/${data.pedidoId}`)}*/}
                {/*            style={{*/}
                {/*                maxWidth: "50%",*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            Detalhes*/}
                {/*        </ActionButton>*/}
                {/*</BlankHeader>*/}
                <div
                    style={{
                        display: "flex",
                        backgroundColor: "var(--branco)",
                    }}
                >
                    <DataTableColumn size={1}>
                        <DataTableRow>
                            <DataTableCell
                                title={"Data Pedido"}
                            >
                                {formatToDate(data.dataPedido)}
                            </DataTableCell>
                        </DataTableRow>
                        <DataTableRow>
                            <DataTableCell
                                title={"Prev. Entrega"}
                            >
                                {formatToDate(data.dataPrevisao)}
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableColumn>

                    <DataTableColumn size={1}>
                        <DataTableRow>
                            <DataTableCell
                                title={"Unidade"}
                            >
                                {data.unidade}
                            </DataTableCell>
                        </DataTableRow>

                        <DataTableRow>
                            <DataTableCell
                                title={"Solicitante"}
                            >
                                {data.solicitante}
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableColumn>
                </div>
            </>
        );

    return (
        <TableRow stripped={stripped}
                  dropdown={true}
                  content={dropdownContent}
        >
            <RowPiece size={1}>
                {idConversor(data.pedidoId)}
            </RowPiece>
            <RowPiece size={3}>
                {data.nomeFornecedor}
            </RowPiece>
            <RowPiece size={2}>
                {formatToReais(data.valorTotal)}
            </RowPiece>
            <RowPiece size={2}>
                {<StageBadge variant={data.nfe ? "green" : "yellow"} outline={true}> {data.nfe ? "ENCONTRADO" : "PENDENTE"}</StageBadge>}
            </RowPiece>
            <RowPiece size={1}>
                <EnviadosReceberButton pedidoId={data.pedidoId}/>
            </RowPiece>
        </TableRow>
    );
});

export default EfetuadosRow;


interface EnviadosReceberButtonProps {
    pedidoId: number;
}

function EnviadosReceberButton({ pedidoId }: EnviadosReceberButtonProps) {
    // Obtém o endpoint para a mutação
    const recebidoEndpoint = useEndpoint().pedido().PATCH().receber(pedidoId);
    const { refreshView } = useView();
    const { success } = useToastManager();

    // Hook para realizar a mutação
    const { execute, isLoading, isError, error, isSuccess } = useMutate(recebidoEndpoint, {
        method: "PATCH"
    });

    // Função para lidar com o clique no botão
    const handleClick = () => {
        execute({});
    };

    useEffect(() => {
        if (isSuccess) {
            success("Pedido recebido com sucesso");
            refreshView();
        }
    }, [refreshView, isSuccess]);

    useErrorHandling(isError, error, "Erro ao receber pedido");

    return (
        <ActionButton
            variant="details"
            size="small"
            value="register"
            type="submit"
            onClick={handleClick}
            disabled={isLoading}
            hasLoading={isLoading}
        >
            Receber
        </ActionButton>
    );
}
