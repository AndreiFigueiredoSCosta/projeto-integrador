import {TableRow} from "../../../../../../../../../../components/table/TableRow";
import EstadoEnum from "../../../../../../../../../../enums/EstadoEnum.ts";
import {RowPiece} from "../../../../../../../../../../components/table/components/RowPiece";
import {ActionButton} from "../../../../../../../../../../components/buttons/action/ActionButton";
import formatToReais from "../../../../../../../../../../utils/formatToReais.ts";
import DataTableColumn from "../../../../../../../../../../components/dataTable/DataTableColumn";
import DataTableRow from "../../../../../../../../../../components/dataTable/DataTableRow";
import DataTableCell from "../../../../../../../../../../components/dataTable/DataTableCell";
import {P} from "../../../../../../../../../../components/text/P";
import CotacaoAprovacaoItemResponseData
    from "../../../../../../../../../../models/cotacao/aprovacao/CotacaoAprovacaoItemResponseData.ts";
import IconButton from "../../../../../../../../../../components/misc/IconButton";


interface ClonagemFornecedorRowProps {
    data: CotacaoAprovacaoItemResponseData,
    quantidadeTotal: number,
    handleClassificar: (value: -1 | 0 | 1) => void;
    handleDesclassificar: () => void;
    handlePreaprovar: () => void;
    stripped: boolean;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoAprovacaoCotacaoRow({
                                                       data,
                                                       stripped,
                                                       handleClassificar,
                                                       handleDesclassificar,
                                                       handlePreaprovar,
                                                       quantidadeTotal
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
                        {formatToReais(data.detalhes.precoUnit)}
                    </DataTableCell>
                </DataTableColumn>
                <DataTableColumn>
                    <DataTableCell
                        type={"text"}
                        contentTextSize={"medium"}
                        title={"Valor Total"}
                    >
                        {formatToReais(data.detalhes.precoUnit*data.quantidadeCotada)}
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
                        {data.detalhes.observacao}
                    </DataTableCell>
                </DataTableColumn>
            </DataTableRow>
        </div>
    );

    return (
        <TableRow
            stripped={stripped}
            approved={data.estado === EstadoEnum.APROVADO}
            rejected={data.estado === EstadoEnum.DESCLASSIFICADO}
            removed={data.estado === EstadoEnum.DESCLASSIFICADO}
            noClickDropdown={data.estado !== EstadoEnum.PREAPROVADO && data.estado !== EstadoEnum.APROVADO}
            dropdown={true}
            content={dropdownContent}
        >
            <RowPiece size={4}>
                {data.nomeFornecedor}
            </RowPiece>
            <RowPiece size={1}>
                {data.quantidadeCotada}/{quantidadeTotal}
            </RowPiece>
            <RowPiece size={1}>
                --- EM PRODUÇÃO ---
            </RowPiece>
            <RowPiece size={4}>
                {
                    data.estado !== EstadoEnum.DESCLASSIFICADO ?
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: "center"
                            }}
                        >
                            <ActionButton
                                variant={"submit"}
                                size={"small"}
                                onClick={handlePreaprovar}
                                style={{
                                    width: "fit-content"
                                }}
                                disabled={data.estado === EstadoEnum.APROVADO}
                            >
                                {
                                    data.estado === EstadoEnum.APROVADO ?
                                        "aprovado"
                                        :
                                        "aprovar"
                                }
                            </ActionButton>
                            <ActionButton
                                variant={"delete"}
                                size={"small"}
                                onClick={handleDesclassificar}
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
                            uppercase={true}
                            bold={true}
                        >
                            Desclassificado
                        </P>
                }
            </RowPiece>
            <RowPiece size={2}>
                <div style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center"
                }}>
                    <IconButton
                        variant={"like"}
                        onClick={() => handleClassificar(1)}
                        selected={data.classificacao == 1}
                        size={"small"}
                    />
                    <IconButton
                        variant={"dislike"}
                        onClick={() => handleClassificar(-1)}
                        selected={data.classificacao == -1}
                        size={"small"}
                    />
                </div>
            </RowPiece>
        </TableRow>
    );
}
