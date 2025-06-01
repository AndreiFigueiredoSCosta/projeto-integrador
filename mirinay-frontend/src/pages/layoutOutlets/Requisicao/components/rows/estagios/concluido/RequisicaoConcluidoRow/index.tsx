import {memo} from "react";
import {TableRow} from "../../../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import DataTableColumn from "../../../../../../../../components/dataTable/DataTableColumn";
import DataTableContainer from "../../../../../../../../components/dataTable/DataTableContainer";
import DataTableRow from "../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../components/dataTable/DataTableCell";
import formatToReais from "../../../../../../../../utils/formatToReais.ts";
import RequisicaoConcluidoDetailsResponseData
    from "../../../../../../../../models/requisicao/concluido/RequisicaoConcluidoDetailsResponseData.ts";

interface ClonagemRowProps {
    data: RequisicaoConcluidoDetailsResponseData,
    stripped: boolean
}

/**
 * Linha de exibição de item de um produto de uma clonagem
 */
const RequisicaoConcluidoRow = memo(
    function RequisicaoConcluidoRow ({
                                     data,
                                     stripped}
                                     : ClonagemRowProps){
    const dropdownContent =
        (
            <DataTableContainer rowsNumber={3}>

                <DataTableColumn size={1}>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Quantidade (UN)"}>
                            {data.detalhes.quantidade}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Valor Unit."}>
                            {formatToReais(data.detalhes.valor)}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Valor Total"}>
                            {formatToReais(data.detalhes.valor*data.detalhes.quantidade)}
                        </DataTableCell>
                    </DataTableRow>

                </DataTableColumn>

                <DataTableColumn size={1}>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Marca"}>
                            {data.detalhes.marca}
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={"Tempo de Entrega"}>
                            {data.detalhes.tempoEntrega} Dias
                        </DataTableCell>
                    </DataTableRow>

                    <DataTableRow size={1}>
                        <DataTableCell type={"text"} title={""} contentTextSize={"small"}>
                            {data.detalhes.observacao}
                        </DataTableCell>
                    </DataTableRow>
                </DataTableColumn>

            </DataTableContainer>
        );

    return (
        <TableRow stripped={stripped}
                  dropdown={true}
                  content={dropdownContent}
                  removed={data.estado == EstadoEnum.REMOVIDO
                      || data.estado == EstadoEnum.DESCLASSIFICADO
                      || data.estado == EstadoEnum.DESAPROVADO
                      || data.estado == EstadoEnum.NAOENCONTRADO
                  }
        >
            <RowPiece size={12}>
                {data.nome}
            </RowPiece>
        </TableRow>
    );
});

export default RequisicaoConcluidoRow;

