import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import TransportadorCnpjResponseData
    from "../../../../../../models/transportador/response/TransportadorCnpjResponseData.ts";
import MatrizFilialEnum from "../../../../../../enums/MatrizFilialEnum.ts";
import {P} from "../../../../../../components/text/P";

interface SimilarRowProps {
    data: TransportadorCnpjResponseData;
    stripped: boolean;
}

/**
 * Linha de exibição de similares
 * @constructor
 */
export default function TransportadorFilialRow({ data, stripped } : SimilarRowProps){
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
                    {data.transportadorCnpjId} - {data.nome}
                </div>
            </RowPiece>
            <RowPiece size={3} selected={matriz}>
                {data.cnpj}
            </RowPiece>
            <RowPiece size={3} selected={matriz}>
                {data.email}
            </RowPiece>
            <RowPiece size={3} selected={matriz} textSize={data.celular?"small":"medium"}>
                {data.telefone} <br/>
                {data.celular && <>{data.celular} (celular)</>}
            </RowPiece>
        </TableRow>
    );
}
