import {TableRow} from "../../../../../../../../../../components/table/TableRow";
import EstadoEnum from "../../../../../../../../../../enums/EstadoEnum.ts";
import {RowPiece} from "../../../../../../../../../../components/table/components/RowPiece";
import {ActionButton} from "../../../../../../../../../../components/buttons/action/ActionButton";
import formatToReais from "../../../../../../../../../../utils/formatToReais.ts";
import DataTableColumn from "../../../../../../../../../../components/dataTable/DataTableColumn";
import DataTableRow from "../../../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../../../components/dataTable/DataTableCell";
import CotacaoCotacaoFornecedorItemResponseData
    from "../../../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoFornecedorItemResponseData.ts";
import {P} from "../../../../../../../../../../components/text/P";


interface ClonagemFornecedorRowProps {
    data: CotacaoCotacaoFornecedorItemResponseData,
    handleCotar: () => void;
    handleReap: () => void;
    handleDescl: () => void;
    stripped: boolean;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoCotacaoFornecedorItemRow({
                                                     data,
                                                     stripped,
                                                     handleCotar,
                                                     handleDescl,
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
                        { data.precoUnit ?
                            <>
                                {formatToReais(data.precoUnit)}
                            </>
                            :
                            "-"
                        }
                    </DataTableCell>
                </DataTableColumn>
                <DataTableColumn>
                    <DataTableCell
                        type={"text"}
                        contentTextSize={"medium"}
                        title={"Valor Total"}
                    >
                        { data.precoUnit ?
                            <>
                                {formatToReais(data.precoUnit*data.quantidadeCotada)}
                            </>
                            :
                            "-"
                        }
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
                        {data.observacao}
                    </DataTableCell>
                </DataTableColumn>
            </DataTableRow>
        </div>

    );

    return (
        <TableRow
            stripped={stripped}
            rejected={data.estado === EstadoEnum.DESCLASSIFICADO}
            removed={data.estado === EstadoEnum.DESCLASSIFICADO}
            noClickDropdown={data.estado !== EstadoEnum.PREAPROVADO}
            approved={data.estado === EstadoEnum.PREAPROVADO}
            dropdown={true}
            content={dropdownContent}
        >
            <RowPiece size={4}>
                {data.referencia}({data.marca})
            </RowPiece>
            <RowPiece size={1}>
                {data.quantidadeCotada ? data.quantidadeCotada : 0}/{data.quantidadeItem}
            </RowPiece>
            <RowPiece size={3}>
                {
                    data.precoUltimaCotacao ?
                        <>
                            {formatToReais(data.precoUltimaCotacao)} - {data.dataUltimaCotacao}
                        </>
                        :
                        "-"
                }
            </RowPiece>
            <RowPiece size={4}>
                {
                    data.estado !== EstadoEnum.DESCLASSIFICADO ?
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: "100%"
                        }}>
                            {
                                (data.precoUltimaCotacao && data.estado !== EstadoEnum.PREAPROVADO)&&
                                <ActionButton
                                    variant={"submit"}
                                    size={"small"}
                                    onClick={handleReap}
                                    style={{
                                        width: "fit-content"
                                    }}
                                >
                                    Reap.
                                </ActionButton>
                            }
                            <ActionButton
                                variant={"details"}
                                size={"small"}
                                onClick={handleCotar}
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
                            <ActionButton
                                variant={"delete"}
                                size={"small"}
                                onClick={handleDescl}
                                    style={{
                                        width: "fit-content"
                                    }}
                            >
                                Descl.
                            </ActionButton>
                        </div>
                        :
                        <P
                            justify={"center"}
                            variant={"large"}
                            align={"middle"}
                            color={"red"}
                            bold={true}
                            uppercase={true}
                        >
                            DESCLASSIFICADO
                        </P>
                }
            </RowPiece>
        </TableRow>
    );
}
