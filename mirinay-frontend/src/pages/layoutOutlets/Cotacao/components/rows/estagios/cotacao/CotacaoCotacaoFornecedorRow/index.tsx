import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import {TableRow} from "../../../../../../../../components/table/TableRow";

import {ActionButton} from "../../../../../../../../components/buttons/action/ActionButton";
import {useEffect, useState} from "react";
import DataTableColumn from "../../../../../../../../components/dataTable/DataTableColumn";
import DataTableRow from "../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../components/dataTable/DataTableCell";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import CotacaoCotacaoFornecedorItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoFornecedorItemResponseData.ts";
import CotacaoCotacaoFornecedorResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoFornecedorResponseData.ts";
import CotacaoCotacaoFornecedorItemRow from "./components/CotacaoCotacaoFornecedorItemRow";
import ExcelIcon from "../../../../../../../../assets/Excel/ExcelIcon.tsx";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import useDetails from "../../../../../../../../hooks/useDetails.ts";

interface ClonagemFornecedorRowProps {
    data: CotacaoCotacaoFornecedorResponseData,
    stripped: boolean,
    handleDescl: (data: CotacaoCotacaoFornecedorItemResponseData) => void,
    handleCotar: (data: CotacaoCotacaoFornecedorItemResponseData) => void,
    handleReap: (data: CotacaoCotacaoFornecedorItemResponseData) => void,
    handleGerarExcel: () => void
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoCotacaoFornecedorRow({
                                                        data,
                                                        stripped,
                                                        handleDescl,
                                                        handleReap,
                                                        handleCotar,
                                                        handleGerarExcel
                                                    }
                                                        : ClonagemFornecedorRowProps) {
    const id = useParams().requisicaoId as unknown as number;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {refresh} = useView();
    const {globalRefresh} = useDetails();
    const [ mappedData, setMappedData ] = useState<CotacaoCotacaoFornecedorItemResponseData[]>([]);
    const endpoint = useEndpoint().cotacao().GET().detalhes(id).cotacao().cotacoes().itens(data.cnpjId);
    const {
        data: dropdownData,
        isLoading,
        isError,
        error,
        toggleRequest
    } = useFetch<CotacaoCotacaoFornecedorItemResponseData>(endpoint);

    useEffect(() => {
        if (isDropdownOpen) {
            toggleRequest();
        }
    }, [isDropdownOpen, toggleRequest, refresh, globalRefresh]);

    useEffect(() => {
        if (dropdownData) {
            const mapped = dropdownData as CotacaoCotacaoFornecedorItemResponseData[];
            const cotacoes = mapped?.filter((item) => item.estado !== EstadoEnum.DESCLASSIFICADO);
            const desclassificados = mapped?.filter((item) => item.estado === EstadoEnum.DESCLASSIFICADO);

            return setMappedData(cotacoes?.concat(desclassificados));
        }
    }, [dropdownData, setMappedData]);

    const beforeContent = () => {
        return (
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
        )
    }

    const contentFunction = (data: CotacaoCotacaoFornecedorItemResponseData, index: number) => {
        return (
            <CotacaoCotacaoFornecedorItemRow
                data={data}
                handleCotar={() => handleCotar(data)}
                handleReap={() => handleReap(data)}
                stripped={index % 2 != 0}
                handleDescl={() => handleDescl(data)}
            />
        );
    }

    const dropdownContent = useTableContent<CotacaoCotacaoFornecedorItemResponseData>(
        {
            data: mappedData as CotacaoCotacaoFornecedorItemResponseData[],
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
            dropdown={true}
            content={dropdownContent}
            onClick={() => {
                return setIsDropdownOpen(!isDropdownOpen);
            }}
        >
            <RowPiece size={5}>
                {data.nomeFornecedor}
            </RowPiece>
            <RowPiece size={2}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActionButton
                        variant={"details"}
                        size={"small"}
                        onClick={handleGerarExcel}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "5px",
                            width: "fit-content"
                        }}
                    >
                        GERAR EXCEL <ExcelIcon />
                    </ActionButton>
                </div>
            </RowPiece>
        </TableRow>
    );
}
