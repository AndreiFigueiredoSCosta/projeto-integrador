import ListaPedidosResponseData from "../../../../../../models/pedidos/ListaPedidosResponseData.ts";
import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import ListaPedidosHeader from "../../headers/ListaPedidosHeader/index.tsx";
import PedidosResponseData from "../../../../../../models/pedidos/PedidosResponseData.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import idConversor from "../../../../../../utils/idConversor.ts";
import useView from "../../../../../../hooks/useView.ts";
import ListaPedidosRow from "../ListaPedidosRow/index.tsx";
import formatToReais from "../../../../../../utils/formatToReais.ts";
import useDropdown from "../../../../../../hooks/useDropdown.ts";
import DataTableCell from "../../../../../../components/dataTable/DataTableCell";
import {BlankHeader} from "../../../../../../components/table/BlankHeader";
import {ActionButton} from "../../../../../../components/buttons/action/ActionButton";
import PedidoGerarPedidoModal from "../../../summary/modals/PedidoGerarPedidoModal";

interface PedidoRowProps {
    data: PedidosResponseData,
    stripped: boolean
}

/**
 * Linha de exibição de pedidos
 */
const PedidoRow = memo( function PedidoRow ({ data, stripped } : PedidoRowProps){
    const { refresh } = useView();
    const { rowRefresh } = useDropdown();
    const { toggleRequest, data: requestData, isLoading, error, isError} =
        useFetch<ListaPedidosResponseData>
        (useEndpoint().pedido().GET().itens(data.fornecedorId));
    const [ isDropdownOpen, setIsDropdownOpen ] = useState<boolean>(false);
    const [ itensSelecionados, setItensSelecionados ] = useState<ListaPedidosResponseData[]>([]);
    const [ hideGerarPedidoModal, setHideGerarPedidoModal ] = useState<boolean>(true);

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [refresh, toggleRequest, isDropdownOpen, rowRefresh]);

    const handleSelectItem = (itemData: ListaPedidosResponseData) => {
        return setItensSelecionados((prev) => {
            if(prev.some((item) => item.itemId === itemData.itemId)){
                return prev.filter((item) => item !== itemData);
            }
            return [...prev, itemData];
        });
    }

    const contentFunction =
        (dados: ListaPedidosResponseData, index: number)=> {
        return (
            <>
                <ListaPedidosRow
                    data={dados}
                    stripped={index % 2 == 1}
                    handleSelect={handleSelectItem}
                />
            </>
        );
    }

    const dropdownContent = useTableContent({
        isLoading,
        error,
        isError,
        limited: false,
        data: requestData as ListaPedidosResponseData[],
        errorMessage: "Erro ao carregar itens a pedir.",
        contentFunction: contentFunction,
        beforeContent: () => <ListaPedidosHeader/>,
    })

    return (
        <>
            <PedidoGerarPedidoModal hide={hideGerarPedidoModal}
                        setHide={setHideGerarPedidoModal}
                        itensIds={itensSelecionados.map((item) => item.cotacaoId)}
                        fornecedorId={data.fornecedorId}
            />
            <TableRow stripped={stripped}
                      dropdown={true}
                      content={(
                                <>
                                    <BlankHeader>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            <DataTableCell
                                                title="Produtos (QTD)"
                                                type="text"
                                                style={{
                                                    flex: 2,
                                                }}
                                            >
                                                {itensSelecionados.length} itens selecionados
                                            </DataTableCell>
                                            <DataTableCell
                                                title="Valor Total"
                                                type="text"
                                                style={{
                                                    flex: 2,
                                                }}
                                            >
                                                {formatToReais(itensSelecionados
                                                    .map((item) => item.valorUnitario*item.quantidade)
                                                    .reduce((acc, curr) => acc + curr, 0))}
                                            </DataTableCell>
                                            <DataTableCell
                                                type="blank"
                                                style={{
                                                    flex: 1,
                                                }}
                                            >
                                                <ActionButton
                                                    variant={"details"}
                                                    size={"small"}
                                                    type={`button`}
                                                    onClick={
                                                        () => {
                                                            setHideGerarPedidoModal(false);
                                                        }
                                                    }
                                                    disabled={itensSelecionados.length === 0}
                                                >
                                                    Gerar Pedido
                                                </ActionButton>
                                            </DataTableCell>
                                        </div>
                                    </BlankHeader>
                                    {dropdownContent}
                                </>
                            )}
                      onClick={() => {
                          setIsDropdownOpen((prev) => !prev);
                      }}
            >
                <RowPiece size={1}>
                {idConversor(data.fornecedorId).toString()} - {data.nomeFornecedor}
                </RowPiece>
                <RowPiece size={1}>
                    {formatToReais(data.valorTotal)}
                </RowPiece>
                <RowPiece size={1}>
                    {data.pedidoMinimo} %
                </RowPiece>
                <RowPiece size={1}>
                    {data.observacao}
                </RowPiece>
            </TableRow>
        </>
    );
});

export default PedidoRow;
