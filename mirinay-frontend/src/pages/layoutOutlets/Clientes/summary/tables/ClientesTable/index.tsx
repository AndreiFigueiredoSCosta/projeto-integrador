// ClientesTable.tsx
import { memo, useEffect, useState } from "react";
import { useFetch } from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent/index.tsx";
import { TableContainer } from "../../../../../../components/table/TableContainer/index.tsx";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";
import DeleteModal from "../../../../../../components/modals/DeleteModal/index.tsx";
import ClientesHeader from "../../../components/headers/ClientesHeader/index.tsx";
import { ClienteResumidoDTO } from "../../../../../../models/cliente/ClienteResumidoDTO.ts";
import ClientesRow from "../../../components/rows/ClientesRow/index.tsx";
import ClienteEditModal from "../../modals/ClienteEditModal/index.tsx";
import { ClienteDTO } from "../../../../../../models/cliente/ClienteDTO.ts";

/**
 * Tabela de exibição de clientes
 */
const ClientesTable = memo(function () {
  const { currentView, refresh, refreshView } = useView();
  currentView.endpoint = useEndpoint().cliente().GET().listar;

  const { currentEndpoint } = useSearch();
  const { toggleRequest, data, isLoading, error, isError } = useFetch<ClienteResumidoDTO>(currentEndpoint);

  const [hideDeleteModal, setHideDeleteModal] = useState<boolean>(true);
  const [hideEditModal, setHideEditModal] = useState<boolean>(true);

  // Guarda os dados resumidos e detalhados
  const [selectedResumo, setSelectedResumo] = useState<ClienteResumidoDTO | null>(null);
  const [selectedDetalhado, setSelectedDetalhado] = useState<ClienteDTO | null>(null);

  const handleClick = (
    type: "edit" | "delete",
    infoResumido: ClienteResumidoDTO,
    infoDetalhado?: ClienteDTO
  ) => {
    setSelectedResumo(infoResumido);
    setSelectedDetalhado(infoDetalhado ?? null);

    if (type === "edit") {
      setHideEditModal(false);
    } else {
      setHideDeleteModal(false);
    }
  };

  useEffect(() => {
    toggleRequest();
  }, [toggleRequest, refresh]);

  const contentFunction = (dados: ClienteResumidoDTO, index: number) => (
    <ClientesRow
      stripped={index % 2 === 1}
      data={dados}
      handleClick={handleClick}
    />
  );

  const content = useTableContent<ClienteResumidoDTO>({
    isLoading,
    error,
    isError,
    data: data as ClienteResumidoDTO[],
    errorMessage: "Erro ao carregar clientes",
    contentFunction,
    beforeContent: () => <ClientesHeader />,
  });

  return (
    <>
      <DeleteModal
        hide={hideDeleteModal}
        setHide={setHideDeleteModal}
        request={useEndpoint().cliente().DELETE().delete(selectedResumo?.id as number)}
        errorMessage={"Erro ao deletar cliente."}
        successMessage={"Cliente deletado com sucesso."}
        idToDelete={selectedResumo?.id}
        onDelete={() => {
          refreshView();
          setHideDeleteModal(true);
        }}
      >
        Tem certeza que deseja deletar o cliente {selectedResumo?.nomeCompleto}?
      </DeleteModal>

      <ClienteEditModal
        cliente={selectedDetalhado}
        hide={hideEditModal}
        setHide={setHideEditModal}
      />

      <TableContainer
        barContent={
          <TopBarContent hasSearch={true} hasPagination={true} />
        }
      >
        {content}
      </TableContainer>
    </>
  );
});

export default ClientesTable;
