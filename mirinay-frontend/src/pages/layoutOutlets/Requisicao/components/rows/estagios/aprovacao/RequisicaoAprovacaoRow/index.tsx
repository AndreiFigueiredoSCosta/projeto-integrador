import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import {TableRow} from "../../../../../../../../components/table/TableRow";

import {ActionButton} from "../../../../../../../../components/buttons/action/ActionButton";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import {P} from "../../../../../../../../components/text/P";
import DataTableColumn from "../../../../../../../../components/dataTable/DataTableColumn";
import DataTableRow from "../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../components/dataTable/DataTableCell";
import translateEstadoEnum from "../../../../../../../../utils/translators/translateEstadoEnum.ts";
import formatToReais from "../../../../../../../../utils/formatToReais.ts";
import GetItensDTO from "../../../../../../../../models/requisicao/GetItensDTO.ts";
import DestinoEnum from "../../../../../../../../enums/DestinoEnum.ts";

interface ClonagemFornecedorRowProps {
    data: GetItensDTO,
    stripped: boolean,
    handleReprovar: () => void,
    handleAprovar: () => void,
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function RequisicaoAprovacaoRow({
                                                       data,
                                                       stripped,
                                                       handleReprovar,
                                                       handleAprovar,
                                                   }
                                                       : ClonagemFornecedorRowProps) {
    const invalido = data.estado === EstadoEnum.DESCLASSIFICADO || data.estado === EstadoEnum.REMOVIDO;


    const beforeContent = () => {
        return (
            <>
                <div style={{
                    backgroundColor: "var(--branco)",
                }}>
                    <DataTableRow>
                        <DataTableColumn size={1}>
                            <DataTableRow>
                                <DataTableCell
                                    contentTextSize={"medium"}
                                    title={`Valor unitário`}
                                    type={"text"}
                                >
                                    {formatToReais(data.valorUnitario)}
                                </DataTableCell>

                                <DataTableCell
                                    contentTextSize={"medium"}
                                    title={`Quantidade (${data.unidadeProduto})`}
                                    type={"text"}
                                >
                                    {data.quantidade} {data.unidadeProduto}
                                </DataTableCell>
                            </DataTableRow>

                            <DataTableRow>
                                <DataTableCell
                                    contentTextSize={"medium"}
                                    title={"Valor total"}
                                    type={"text"}
                                >
                                    {formatToReais(data.valorUnitario*data.quantidade)}
                                </DataTableCell>
                            </DataTableRow>
                        </DataTableColumn>

                        <DataTableColumn size={1}>
                            <DataTableRow>
                                <DataTableCell
                                    contentTextSize={"medium"}
                                    title={"Marca"}
                                    type={"text"}
                                >
                                    {data.marca}
                                </DataTableCell>
                            </DataTableRow>

                            <DataTableRow>
                                <DataTableCell
                                    contentTextSize={"medium"}
                                    title={"Tempo de entrega"}
                                    type={"text"}
                                >
                                    {data.tempoEntrega} dias
                                </DataTableCell>
                            </DataTableRow>
                        </DataTableColumn>
                    </DataTableRow>
                    <DataTableRow>
                        <DataTableCell
                            contentTextSize={"small"}
                            title={"Observação"}
                            type={"text"}
                        >
                            {data.observacao}
                        </DataTableCell>
                    </DataTableRow>
                </div>
            </>
        )
    }

    const dropdownContent = (
        <>
            {beforeContent()}
        </>
    );

    return (
        <TableRow
            stripped={stripped}
            removed={invalido}
            rejected={data.estado === EstadoEnum.DESAPROVADO}
            approved={data.estado === EstadoEnum.APROVADO}
            noClickDropdown={invalido}
            dropdown={true}
            content={dropdownContent}
        >
            <RowPiece size={5}>
                {data.nomeProduto}
            </RowPiece>
            <RowPiece size={4} textSize={(!data.marca) ? "medium" : "small"}>
                {data.marca && data.marca} ({data.referencia})
            </RowPiece>
            <RowPiece size={3}>
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
                            <>
                            {
                                data.destino === DestinoEnum.ESTOQUE ?
                                    data.estado === EstadoEnum.APROVADO ?
                                    <P
                                        bold={true}
                                        variant={"large"}
                                        color={"green"}
                                        justify={"center"}
                                        align={"middle"}
                                        uppercase={true}
                                    >
                                        APROVADO PARA ESTOQUE
                                    </P>
                                    :
                                    <P
                                        bold={true}
                                        variant={"large"}
                                        color={"red"}
                                        justify={"center"}
                                        align={"middle"}
                                        uppercase={true}
                                    >
                                        REPROVADO PARA ESTOQUE
                                    </P>
                                :
                                    data.estado === EstadoEnum.APROVADO ?
                                        <P
                                            bold={true}
                                            variant={"large"}
                                            color={"green"}
                                            justify={"center"}
                                            align={"middle"}
                                            uppercase={true}
                                        >
                                            APROVADO
                                        </P>
                                        :
                                        data.estado === EstadoEnum.DESAPROVADO ?
                                            <P
                                                bold={true}
                                                variant={"large"}
                                                color={"red"}
                                                justify={"center"}
                                                align={"middle"}
                                                uppercase={true}
                                            >
                                                REPROVADO
                                            </P>
                                            :
                                            <>
                                                <ActionButton
                                                    variant={"submit"}
                                                    size={"small"}
                                                    onClick={handleAprovar}
                                                    style={{
                                                        width: "fit-content"
                                                    }}
                                                >
                                                    APROVAR
                                                </ActionButton>
                                                <ActionButton
                                                    variant={"delete"}
                                                    size={"small"}
                                                    onClick={handleReprovar}
                                                    style={{
                                                        width: "fit-content"
                                                    }}
                                                >
                                                    REPROVAR
                                                </ActionButton>
                                            </>

                            }
                            </>
                    }
                </div>
            </RowPiece>
        </TableRow>
    );
}
