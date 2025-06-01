import {memo} from "react";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import MargemDTO from "../../../../../../models/margem/MargemDTO.ts";
import IconButton from "../../../../../../components/misc/IconButton";

interface GrupoRowProps {
    data: MargemDTO,
    stripped: boolean,
    handleClick: (type: "edit" | "delete", info: MargemDTO) => void
}
/**
 * Linha de exibição de grupo
 */
const MargemRow = memo( function ({ data, stripped, handleClick } : GrupoRowProps){
    const handleButtonClick = (type: string) =>{
        switch (type){
            case 'edit':
                handleClick('edit', data);
                break;
            case 'delete':
                handleClick('delete', data);
                break;
        }
    }

    return (
        <TableRow stripped={stripped}>
            <RowPiece size={6}>
                {data.nome}
            </RowPiece>
            <RowPiece size={4}>
                {data.valor}
            </RowPiece>
            {/*<RowPiece size={2} style={{*/}
            {/*    display: "flex",*/}
            {/*    justifyContent: "flex-end",*/}
            {/*    gap: "5px"*/}
            {/*}}>*/}
            {/*    <IconButton variant={"edit"} onClick={() => handleButtonClick('edit')} size={"small"}/>*/}
            {/*    <IconButton variant={"delete"} onClick={() => handleButtonClick('delete')} size={"small"}/>*/}
            {/*</RowPiece>*/}
        </TableRow>
    );
});

export default MargemRow;

