import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import MatrizFilialEnum from "../../../../../../enums/MatrizFilialEnum.ts";
import {P} from "../../../../../../components/text/P";
import FornecedorCNPJResponseData from "../../../../../../models/fornecedor/response/FornecedorCNPJResponseData.ts";
import idConversor from "../../../../../../utils/idConversor.ts";

interface SimilarRowProps {
    data: FornecedorCNPJResponseData;
    stripped: boolean;
}

/**
 * Linha de exibição de similares
 * @constructor
 */
export default function FornecedorCNPJRow({ data, stripped } : SimilarRowProps){
    const matriz = data.tipo == MatrizFilialEnum.MATRIZ;

    return (
        <TableRow stripped={stripped} selected={matriz}>
            <RowPiece size={3} selected={matriz}>
                <div style={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "start",
                    gap: "5px",
                    color: "inherit",
                    fontWeight: "inherit",
                    fontSize: "inherit"
                }}>
                    {
                        matriz &&
                        <P
                            variant={"medium"}
                            justify={"center"}
                            align={"middle"}
                            uppercase={true}
                            bold={true}
                            color={"blank"}
                        >
                            (Matriz)
                        </P>
                    }
                    {idConversor(data.id)} - {data.nome}
                </div>
            </RowPiece>
            <RowPiece size={3} selected={matriz}>
                {data.cnpj}
            </RowPiece>
            <RowPiece size={3} selected={matriz}>
                {data.cidade} - {data.estado}
            </RowPiece>
            <RowPiece size={3} selected={matriz} textSize={"small"}>
                {data.telefone} <br/>
                {data.email}
            </RowPiece>
        </TableRow>
    );
}
