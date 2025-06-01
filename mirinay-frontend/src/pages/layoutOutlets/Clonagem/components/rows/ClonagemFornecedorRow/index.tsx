import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../components/misc/IconButton";
import ClonagemFornecedorResponseData from "../../../../../../models/clonagem/response/ClonagemFornecedorResponseData.ts";

interface ClonagemFornecedorRowProps {
    data: ClonagemFornecedorResponseData;
    stripped: boolean;
    handleDelete: () => void;
}

/**
 * Linha de exibição de fornecedor de uma clonagem
 * @constructor
 */
export default function ClonagemFornecedorRow({
                                                  data,
                                                  stripped,
                                                  handleDelete }
                                                  : ClonagemFornecedorRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={10}>
                {data.fornecedorNome}
            </RowPiece>
            <RowPiece size={2}>
                <div style={{
                    display: "flex",
                    gap: "10px",
                    alignContent: "center",
                    justifyContent: "end",
                    padding: "0 10px"
                }}>
                    <IconButton
                        size={"small"}
                        variant={"delete"}
                        onClick={handleDelete}
                    />
                </div>
            </RowPiece>
        </TableRow>
    );
}
