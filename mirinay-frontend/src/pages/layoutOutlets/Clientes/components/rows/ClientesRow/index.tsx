import { memo, useEffect, useState } from "react";
import { useFetch } from "../../../../../../hooks/useFetch.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import { TableRow } from "../../../../../../components/table/TableRow/index.tsx";
import { RowPiece } from "../../../../../../components/table/components/RowPiece/index.tsx";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import idConversor from "../../../../../../utils/idConversor.ts";
import { ClienteResumidoDTO } from "../../../../../../models/cliente/ClienteResumidoDTO.ts";
import { ClienteDTO } from "../../../../../../models/cliente/ClienteDTO.ts";
import IconButton from "../../../../../../components/misc/IconButton/index.tsx";
import ClienteDetalhadoHeader from "../../headers/ClienteDetalhadoHeader/index.tsx";

interface ClienteRowProps {
  data: ClienteResumidoDTO;
  stripped: boolean;
  handleClick: (
    type: "edit" | "delete",
    infoResumido: ClienteResumidoDTO,
    infoDetalhado?: ClienteDTO
  ) => void;
}

/**
 * Linha de exibição de cliente resumido, ainda busca dados detalhados para ações.
 */
const ClientesRow = memo(function ({
  data,
  stripped,
  handleClick,
}: ClienteRowProps) {
  const endpoints = useEndpoint();
  const [detailRequest, setDetailRequest] = useState<string>("");

  const {
    toggleRequest: fetchDetalhado,
    data: detailData,
    isLoading,
    error,
    isError,
  } = useFetch<ClienteDTO>(detailRequest);

  // Define a URL e dispara o fetch ao montar
  useEffect(() => {
    const url = endpoints
      .cliente()
      .GET()
      .exibirClienteDetalhado(data.id.toString());
    setDetailRequest(url);
  }, [data.id, endpoints]);

  useEffect(() => {
    if (detailRequest) {
      fetchDetalhado();
    }
  }, [detailRequest]);

  const handleButtonClick = (type: "edit" | "delete") => {
    handleClick(type, data, detailData as ClienteDTO);
  };

  // Garante que clienteObj seja sempre um único ClienteDTO
  const clienteObj: ClienteDTO | undefined = Array.isArray(detailData)
    ? detailData[0]
    : detailData ?? undefined;

  const dropdownContent = useTableContent<ClienteDTO>({
    isLoading,
    error,
    isError,
    data: clienteObj ? [clienteObj] : [],
    errorMessage: "Erro ao carregar detalhes do cliente",
    contentFunction: (cliente, index) => (
      <TableRow stripped={index % 2 === 1}>
        <RowPiece>{cliente.nomeCompleto}</RowPiece>
        <RowPiece>{cliente.cpf}</RowPiece>
        <RowPiece>{cliente.nascimento}</RowPiece>
        <RowPiece>{cliente.email}</RowPiece>
        <RowPiece>{cliente.telefone}</RowPiece>
      </TableRow>
    ),
    beforeContent: () => <ClienteDetalhadoHeader />,
    limited: false,
  });

  return (
    <TableRow stripped={stripped} dropdown={true} content={dropdownContent}>
      <RowPiece>{idConversor(data.id)}</RowPiece>
      <RowPiece>{data.nomeCompleto}</RowPiece>
      <RowPiece>{data.cpf}</RowPiece>
      <RowPiece>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <IconButton
            variant="edit"
            onClick={() => handleButtonClick("edit")}
            size={"small"}
          />
          <IconButton
            variant="delete"
            onClick={() => handleButtonClick("delete")}
            size={"small"}
          />
        </div>
      </RowPiece>
    </TableRow>
  );
});

export default ClientesRow;
