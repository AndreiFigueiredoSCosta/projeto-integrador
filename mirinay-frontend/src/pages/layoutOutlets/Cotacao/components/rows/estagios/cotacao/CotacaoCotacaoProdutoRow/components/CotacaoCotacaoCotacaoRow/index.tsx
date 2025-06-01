import CotacaoCotacaoCotacaoResponseData
    from "../../../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoCotacaoResponseData.ts";
import {TableRow} from "../../../../../../../../../../components/table/TableRow";
import EstadoEnum from "../../../../../../../../../../enums/EstadoEnum.ts";
import {RowPiece} from "../../../../../../../../../../components/table/components/RowPiece";
import {ActionButton} from "../../../../../../../../../../components/buttons/action/ActionButton";
import formatToReais from "../../../../../../../../../../utils/formatToReais.ts";
import DataTableColumn from "../../../../../../../../../../components/dataTable/DataTableColumn";
import DataTableRow from "../../../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../../../components/dataTable/DataTableCell";
import {P} from "../../../../../../../../../../components/text/P";


interface ClonagemFornecedorRowProps {
    data: CotacaoCotacaoCotacaoResponseData,
    quantidadeTotal: number,
    handleCotar: (data: CotacaoCotacaoCotacaoResponseData) => void;
    handleReap: (data: CotacaoCotacaoCotacaoResponseData) => void;
    stripped: boolean;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoCotacaoCotacaoRow({
                                                     data,
                                                     stripped,
                                                     handleCotar,
                                                     quantidadeTotal,
                                                     handleReap
                                                 }
                                                        : ClonagemFornecedorRowProps){

    const dropdownContent = (
        <div style={{backgroundColor: "var(--branco)"}}>
            <DataTableRow>
                <DataTableColumn>
                    <DataTableCell
                        type={"text"}
                        contentTextSize={"medium"}
                        title={"Preço unitário"}
                    >
                        {formatToReais(data.precoUnit)}
                    </DataTableCell>
                </DataTableColumn>
                <DataTableColumn>
                    <DataTableCell
                        type={"text"}
                        contentTextSize={"medium"}
                        title={"Valor Total"}
                    >
                        {formatToReais(data.precoUnit*data.quantidade)}
                    </DataTableCell>
                </DataTableColumn>
            </DataTableRow>
            <DataTableRow>
                <DataTableColumn>
                    <DataTableCell
                        contentTextSize={"small"}
                        title={"Observações"}
                        type={"text"}
                    >

                    </DataTableCell>
                </DataTableColumn>
            </DataTableRow>
        </div>
    );

    return (
        <TableRow
            stripped={stripped}
            selected={data.estado === EstadoEnum.PREAPROVADO}
            rejected={data.estado === EstadoEnum.DESCLASSIFICADO}
            removed={data.estado === EstadoEnum.DESCLASSIFICADO}
            noClickDropdown={data.estado !== EstadoEnum.PREAPROVADO}
            dropdown={true}
            content={dropdownContent}
        >
            <RowPiece size={5}>
                {data.nomeFornecedor}
            </RowPiece>
            <RowPiece size={3}>{
                data.precoUltimaCotacao ?
                    <>
                        {formatToReais(data.precoUltimaCotacao)} - {data.dataUltimaCotacao}
                    </>
                    :
                    "-"
            }
            </RowPiece>
            <RowPiece size={1}>
                {data.quantidade ? data.quantidade : 0}/{quantidadeTotal}
            </RowPiece>
            <RowPiece size={3}>
                {
                    data.estado !== EstadoEnum.DESCLASSIFICADO ?
                    <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center"
                    }}
                >
                    {
                        (data.precoUltimaCotacao && data.estado !== EstadoEnum.PREAPROVADO) &&
                        <ActionButton
                            variant={"submit"}
                            size={"small"}
                            onClick={() => handleReap(data)}
                            style={{width: "fit-content"}}
                        >
                            Reap.
                        </ActionButton>
                    }
                    <ActionButton
                        variant={"details"}
                        size={"small"}
                        onClick={() => handleCotar(data)}
                        style={{
                            width: "fit-content"
                        }}
                    >
                        {
                            data.estado === EstadoEnum.PREAPROVADO ?
                                "Recotar"
                                :
                                "Cotar"
                        }
                    </ActionButton>
                </div>
                        :
                        <P justify={"center"} variant={"large"} align={"middle"} color={"red"} uppercase={true} bold={true}>
                            Desclassificado
                        </P>
                }
            </RowPiece>
        </TableRow>
    );
}
