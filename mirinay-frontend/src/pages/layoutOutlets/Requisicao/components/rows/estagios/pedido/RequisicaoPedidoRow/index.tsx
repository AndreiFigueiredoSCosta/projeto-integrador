import {memo, useEffect, useState} from "react";
import {TableRow} from "../../../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import DataTableColumn from "../../../../../../../../components/dataTable/DataTableColumn";
import DataTableContainer from "../../../../../../../../components/dataTable/DataTableContainer";
import DataTableRow from "../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../components/dataTable/DataTableCell";
import formatToReais from "../../../../../../../../utils/formatToReais.ts";
import translateEstadoEnum from "../../../../../../../../utils/translators/translateEstadoEnum.ts";
import {StageBadge} from "../../../../../../../../components/misc/badges/default/StageBadge";
import {P} from "../../../../../../../../components/text/P";
import formatToDate from "../../../../../../../../utils/formatToDate.ts";
import GetItensDTO from "../../../../../../../../models/requisicao/GetItensDTO.ts";

interface ClonagemRowProps {
    data: GetItensDTO,
    stripped: boolean
}

/**
 * Linha de exibição de item de um produto de uma clonagem
 */
const RequisicaoPedidoRow = memo(
    function RequisicaoPedidoRow ({
                                     data,
                                     stripped}
                                     : ClonagemRowProps){
    const [ badgeColor, setBadgeColor ] = useState<'green' | 'yellow' | 'black' | 'red' | 'gray' | 'alt-green'>("gray");
    const invalid = data.estado == EstadoEnum.REMOVIDO
                      || data.estado == EstadoEnum.DESCLASSIFICADO
                      || data.estado == EstadoEnum.DESAPROVADO
                      || data.estado == EstadoEnum.NAOENCONTRADO;
    const valid = data.estado == EstadoEnum.A_PEDIR
                     || data.estado == EstadoEnum.EMTRANSITO
                     || data.estado == EstadoEnum.ENTREGUE;
    const dropdownContent =
        (
            <DataTableContainer rowsNumber={3}>
                <DataTableColumn size={1}>
                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={`Quantidade (${data.unidadeProduto})`}>
                            {data.quantidade} {data.unidadeProduto}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Valor Unit."}>
                            {formatToReais(data.valorUnitario)}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Valor Total"}>
                            {formatToReais(data.valorUnitario*data.quantidade)}
                        </DataTableCell>
                    </DataTableRow>

                </DataTableColumn>

                <DataTableColumn size={1}>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Marca (REFERÊNCIA)"}>
                            {data.marca} ({data.referencia})
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Prev. de Entrega"}>
                            {data.prevEntrega ? formatToDate(data.prevEntrega) : "A pedir"}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Observação"} contentTextSize={"small"}>
                            {data.observacao}
                        </DataTableCell>
                    </DataTableRow>
                </DataTableColumn>

            </DataTableContainer>
        );

        useEffect(() => {
            switch (data.estado) {
                case EstadoEnum.A_PEDIR:
                    return setBadgeColor("yellow")
                case EstadoEnum.EMTRANSITO:
                    return setBadgeColor("alt-green")
                case EstadoEnum.ENTREGUE:
                    return setBadgeColor("green")
                default:
                    return setBadgeColor("gray")
            }
        }, [data]);

    return (
        <TableRow stripped={stripped}
                  dropdown={true}
                  content={dropdownContent}
                  approved={data.estado == EstadoEnum.ENTREGUE}
                  removed={invalid}
                  noClickDropdown={invalid}
        >
            <RowPiece size={9}>
                {data.nomeProduto}
            </RowPiece>
            <RowPiece size={3}>
                {
                    invalid ?
                        <P
                            bold={true}
                            variant={"large"}
                            color={"red"}
                            justify={"center"}
                            uppercase={true}
                            align={"middle"}
                        >
                            {translateEstadoEnum(data.estado)}
                        </P>
                        :
                        valid ?
                            <StageBadge variant={badgeColor}>
                                {translateEstadoEnum(data.estado)}
                            </StageBadge>
                            :
                            <P
                                bold={true}
                                variant={"large"}
                                color={"black"}
                                justify={"center"}
                                uppercase={true}
                                align={"middle"}
                            >
                                DESCONHECIDO
                            </P>
                }
            </RowPiece>
        </TableRow>
    );
});

export default RequisicaoPedidoRow;

