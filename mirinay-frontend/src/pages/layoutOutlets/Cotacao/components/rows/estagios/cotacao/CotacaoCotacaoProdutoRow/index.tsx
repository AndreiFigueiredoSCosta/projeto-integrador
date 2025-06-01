import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import {TableRow} from "../../../../../../../../components/table/TableRow";

import {ActionButton} from "../../../../../../../../components/buttons/action/ActionButton";
import idConversor from "../../../../../../../../utils/idConversor.ts";
import {useEffect, useState} from "react";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import {P} from "../../../../../../../../components/text/P";
import CotacaoCotacaoItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoItemResponseData.ts";
import CotacaoCotacaoCotacaoResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoCotacaoResponseData.ts";
import DataTableColumn from "../../../../../../../../components/dataTable/DataTableColumn";
import DataTableRow from "../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../components/dataTable/DataTableCell";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import CotacaoCotacaoCotacaoRow from "./components/CotacaoCotacaoCotacaoRow";
import translateEstadoEnum from "../../../../../../../../utils/translators/translateEstadoEnum.ts";
import CotacaoCotacaoCotacaoHeader from "./components/CotacaoCotacaoCotacaoHeader";
import useView from "../../../../../../../../hooks/useView.ts";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import {AlertasBadge} from "../../../../../../../../components/misc/badges/request/AlertasBadge";
import {ProdutoUltimosPedidosBadge} from "../../../../../../../../components/misc/badges/request/ProdutoUltimosPedidosBadge";
import {ProdutoEstoqueBadge} from "../../../../../../../../components/misc/badges/request/ProdutoEstoqueBadge";
import {ProdutoEstatisticasBadge} from "../../../../../../../../components/misc/badges/request/ProdutoEstatisticasBadge";

interface ClonagemFornecedorRowProps {
    data: CotacaoCotacaoItemResponseData;
    stripped: boolean;
    handleDescl: (data: CotacaoCotacaoItemResponseData) => void;
    handleCotar: (data: CotacaoCotacaoCotacaoResponseData) => void;
    handleReap: (data: CotacaoCotacaoCotacaoResponseData) => void;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoCotacaoProdutoRow({
                                                     data,
                                                     stripped,
                                                     handleDescl,
                                                     handleReap,
                                                     handleCotar}
                                                     : ClonagemFornecedorRowProps){
    const id = useParams().requisicaoId as unknown as number;
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const { refresh } = useView();
    const { globalRefresh } = useDetails();
    const dataQuantidade = (data as CotacaoCotacaoItemResponseData).quantidade;
    const invalido = data.estado === EstadoEnum.DESCLASSIFICADO || data.estado === EstadoEnum.REMOVIDO;
    const endpoint = useEndpoint().cotacao().GET().detalhes(id).cotacao().itens().cotacoes(data.itemId);
    const [ mappedData, setMappedData ] = useState<CotacaoCotacaoCotacaoResponseData[]>([]);
    const { data: dropdownData, isLoading, isError, error, toggleRequest } = useFetch<CotacaoCotacaoCotacaoResponseData>(endpoint);

    useEffect(() => {
        if(isDropdownOpen){
            toggleRequest();
        }
    }, [isDropdownOpen, toggleRequest, refresh, globalRefresh]);

    useEffect(() => {
        if (dropdownData) {
            const mapped = dropdownData as CotacaoCotacaoCotacaoResponseData[];
            const cotacoes = mapped?.filter((item) => item.estado !== EstadoEnum.DESCLASSIFICADO);
            const desclassificados = mapped?.filter((item) => item.estado === EstadoEnum.DESCLASSIFICADO);

            return setMappedData(cotacoes?.concat(desclassificados));
        }
    }, [dropdownData, setMappedData]);

    const beforeContent = () => {
        return (
            <>
                <div style={{
                    backgroundColor: "var(--branco)",
                }}>
                    <DataTableColumn size={1}>
                        <DataTableRow>
                            <DataTableCell
                                contentTextSize={"small"}
                                title={"Observação"}
                                type={"text"}
                            >
                                {data.observacao}
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableColumn>
                </div>
                <CotacaoCotacaoCotacaoHeader />
            </>
        )
    }

    const contentFunction = (data: CotacaoCotacaoCotacaoResponseData, index: number) => {
        return (
            <CotacaoCotacaoCotacaoRow
                data={data}
                handleCotar={handleCotar}
                handleReap={handleReap}
                stripped={index % 2 != 0}
                quantidadeTotal={dataQuantidade}
            />
        );
    }

    const dropdownContent = useTableContent<CotacaoCotacaoCotacaoResponseData>(
        {
            data: mappedData as CotacaoCotacaoCotacaoResponseData[],
            isLoading,
            isError,
            error,
            beforeContent,
            contentFunction,
            errorMessage: "Erro ao carregar cotações",
            limited: false
        }
    )


    return (
        <TableRow
            stripped={stripped}
            rejected={data.estado === EstadoEnum.DESCLASSIFICADO}
            removed={invalido}
            noClickDropdown={invalido}
            dropdown={true}
            content={dropdownContent}
            onClick={() => {
                return setIsDropdownOpen(!isDropdownOpen);
            }}
        >
            <RowPiece size={4}>
                {
                    data.nomeProduto ?
                        idConversor(data.produtoId) + " - " + data.nomeProduto
                        :
                        "Produto não encontrado"
                }
            </RowPiece>
            <RowPiece size={2} textSize={!data.marca ? "medium" : "small"}>
                {data.marca && data.marca} ({data.referencia})
            </RowPiece>
                {
                    !invalido &&
                        <RowPiece size={5} style={{display: "flex", gap: "5px"}}>
                            <AlertasBadge id={data.itemId} />
                            <ProdutoUltimosPedidosBadge produtoId={data.produtoId} />
                            <ProdutoEstoqueBadge produtoId={data.produtoId} />
                            <ProdutoEstatisticasBadge produtoId={data.produtoId} />
                        </RowPiece>
                }
            <RowPiece size={invalido ? 6 : 2}>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center"
                    }}
                >
                    {
                        invalido ?
                            <P bold={true} variant={"large"} color={"red"}>
                                {translateEstadoEnum(data.estado)}
                            </P>
                            :
                            <ActionButton
                                variant={"delete"}
                                size={"small"}
                                onClick={() => handleDescl(data)}
                                style={{
                                    width: "fit-content"
                                }}
                            >
                                DESCL.
                            </ActionButton>
                    }
                </div>
            </RowPiece>
        </TableRow>
    );
}
