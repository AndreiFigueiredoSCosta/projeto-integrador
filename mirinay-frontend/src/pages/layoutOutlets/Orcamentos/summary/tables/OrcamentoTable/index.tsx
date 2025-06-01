import { memo, useEffect, useState } from "react";
import { useFetch } from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent/index.tsx";
import { TableContainer } from "../../../../../../components/table/TableContainer/index.tsx";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";
import OrcamentoHeader from "../../../components/headers/OrcamentoHeader/index.tsx";
import { OrcamentoResponseData } from "../../../../../../models/orcamentos/response/OrcamentoResponseData.ts";
import OrcamentosRow from "../../../components/rows/OrcamentosRow/index.tsx";

interface OrcamentoTableProps {
  handleInsert: (info: OrcamentoResponseData) => void;
}

const OrcamentoTable = memo(function OrcamentoTable({ handleInsert }: OrcamentoTableProps) {
  const { currentView, refresh, refreshView, isSubmitContainerVisible } = useView();
  currentView.endpoint = `${useEndpoint().orcamentos().GET().listar}`;

  const { currentEndpoint } = useSearch();
  const { toggleRequest, data, isLoading, error, isError } = useFetch<OrcamentoResponseData>(currentEndpoint);

  useEffect(() => {
    toggleRequest();
  }, [toggleRequest, refresh]);

  const contentFunction = (dados: OrcamentoResponseData, index: number) => {
    return (
      <OrcamentosRow
        data={dados}
        stripped={index % 2 === 1}
        handleClick={(type) => {
          if (type === "insert") {
            handleInsert(dados);
          } else {
            // a deleção será tratada pelo próprio row
          }
        }}
      />
    );
  };

  const content = useTableContent<OrcamentoResponseData>({
    isLoading,
    error,
    isError,
    data: data as OrcamentoResponseData[],
    errorMessage: "Erro ao carregar orçamentos!",
    contentFunction,
    beforeContent: () => <OrcamentoHeader />,
  });

  if(isSubmitContainerVisible){
    return null
  }

  return (
    <TableContainer barContent={<TopBarContent />}>
      {content}
    </TableContainer>
  );
});

export default OrcamentoTable;
