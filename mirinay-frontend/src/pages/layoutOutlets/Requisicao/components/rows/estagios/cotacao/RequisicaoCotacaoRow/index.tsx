import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import {TableRow} from "../../../../../../../../components/table/TableRow";
import IconButton from "../../../../../../../../components/misc/IconButton";
import {StatusBadge} from "../../../../../../../../components/misc/badges/default/StatusBadge";
import RequisicaoCotacaoResponseData
    from "../../../../../../../../models/requisicao/cotacao/RequisicaoCotacaoResponseData.ts";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";
import translateEstadoEnum from "../../../../../../../../utils/translators/translateEstadoEnum.ts";

interface ClonagemFornecedorRowProps {
    data: RequisicaoCotacaoResponseData;
    stripped: boolean;
    handleAlert: () => void;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function RequisicaoCotacaoRow({
                                                  data,
                                                  stripped,
                                                  handleAlert }
                                                  : ClonagemFornecedorRowProps){
    const setStatus = () => {
        switch (data.estado) {
            case EstadoEnum.DESCLASSIFICADO:
                return "danger"
            case EstadoEnum.REMOVIDO:
                return "danger"
            case EstadoEnum.COTANDO:
                return "warning"
            case EstadoEnum.PREAPROVADO:
                return "success"
            default:
                return "warning"
        }
    }

    return (
        <TableRow stripped={stripped}>
            <RowPiece size={3}>
                {data.referencia}
            </RowPiece>
            <RowPiece size={1} textSize={"large"}>
                {data.quantidade}
            </RowPiece>
            <RowPiece size={4} textSize={"small"}>
                {data.observacao}
            </RowPiece>
            <RowPiece size={3}>
                <StatusBadge
                    variant={setStatus()}
                    uppercase={true}
                >
                    {translateEstadoEnum(data.estado)}
                </StatusBadge>
            </RowPiece>
            <RowPiece size={1}>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px"
                }}>
                    <IconButton size={"small"} variant={"comment"} onClick={() => handleAlert()}/>
                </div>
            </RowPiece>
        </TableRow>
    );
}
