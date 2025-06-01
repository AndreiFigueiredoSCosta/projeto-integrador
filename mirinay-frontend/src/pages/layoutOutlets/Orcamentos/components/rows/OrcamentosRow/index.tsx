import { memo, useState } from "react";
import { TableRow } from "../../../../../../components/table/TableRow/index.tsx";
import { RowPiece } from "../../../../../../components/table/components/RowPiece/index.tsx";
import idConversor from "../../../../../../utils/idConversor.ts";
import IconButton from "../../../../../../components/misc/IconButton/index.tsx";
import DeleteModal from "../../../../../../components/modals/DeleteModal/index.tsx";
import { OrcamentoResponseData } from "../../../../../../models/orcamentos/response/OrcamentoResponseData.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useView from "../../../../../../hooks/useView.ts";
import { BlankHeader } from "../../../../../../components/table/BlankHeader/index.tsx";
import { ActionButton } from "../../../../../../components/buttons/action/ActionButton/index.tsx";
import { HeaderPiece } from "../../../../../../components/table/components/HeaderPiece/index.tsx";

interface OrcamentoRowProps {
  data: OrcamentoResponseData;
  stripped: boolean;
  handleClick: (type: "delete" | "insert") => void;
}

const OrcamentosRow = memo(function OrcamentosRow({
  data,
  stripped,
  handleClick
}: OrcamentoRowProps) {
  const { refreshView } = useView();
  const [hideDelete, setHideDelete] = useState<boolean>(true);

  const dropdownContent = (
    <BlankHeader>
      <div
        style={{
          width: "100%",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <HeaderPiece />
        <ActionButton
          variant="details"
          onClick={() => {
            // redirecionar para página de detalhes
          }}
          size="small"
        >
          Detalhes
        </ActionButton>
        <HeaderPiece />
        <ActionButton
          variant="details"
          onClick={() => {
            // redirecionar para página de venda
          }}
          size="small"
        >
          Converter em venda
        </ActionButton>
        <HeaderPiece />
      </div>
    </BlankHeader>
  );

  return (
    <>
      <DeleteModal
        hide={hideDelete}
        setHide={setHideDelete}
        request={useEndpoint().orcamentos().DELETE().deletar(`${data.orcamentoId}`)}
        errorMessage={"Erro ao deletar orçamento!"}
        successMessage={"Orçamento deletado com sucesso!"}
        onDelete={() => {
          refreshView();
        }}
      >
        Tem certeza que deseja deletar o orçamento {data.orcamentoId}?
      </DeleteModal>

      <TableRow stripped={stripped} dropdown={true} content={dropdownContent}>
        <RowPiece>{idConversor(data.orcamentoId)}</RowPiece>
        <RowPiece>{data.vendedor}</RowPiece>
        <RowPiece>{data.cliente}</RowPiece>
        <RowPiece>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <IconButton
              variant="delete"
              onClick={() => setHideDelete(false)}
              size={"small"}
            />
          </div>
        </RowPiece>
      </TableRow>
    </>
  );
});

export default OrcamentosRow;
