import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import { useRef } from "react";
import { useMutate } from "../../../../../../hooks/useMutate.ts";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import Input from "../../../../../../components/form/input/Input/index.tsx";
import FormModal from "../../../../../../components/modals/FormModal/index.tsx";
import { ClienteDTO } from "../../../../../../models/cliente/ClienteDTO.ts";

type ClienteEditModalProps = {
  cliente: ClienteDTO | null;
  hide: boolean;
  setHide: (value: boolean | ((prevState: boolean) => boolean)) => void;
};

export default function ClienteEditModal({
  cliente,
  setHide,
  hide,
}: ClienteEditModalProps) {
  const { refreshView } = useView();
  const endpoint = useEndpoint().cliente().PUT().editar;
  const formRef = useRef<HTMLFormElement>(null);
  const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint, { method: 'PUT' });

  const formHandler = (formData: FormData) => {
    if (!cliente) return;
    const RequestData: ClienteDTO = {
      clienteId: Number(formData.get("id")),
      nomeCompleto: formData.get("nome") as string,
      cpf: formData.get("cpf") as string,
      email: formData.get("email") as string,
      telefone: formData.get("telefone") as string,
      nascimento: formData.get("nascimento") as string,
    };
    execute(RequestData);
  };

  const handleEdit = useFormHandler({
    formRef,
    isSuccess,
    onSuccess: () => {
      refreshView();
      setHide(true);
    },
    isError,
    error,
    formHandler,
    successMessage: "Cliente editado com sucesso.",
    errorMessage: "Erro ao editar cliente.",
  });

  return (
    <FormModal
      hide={hide}
      setHide={setHide}
      title={"Editar Cliente"}
      onSubmit={handleEdit}
      formRef={formRef}
      isLoading={isLoading}
      btnText={"Editar"}
    >
        <Input
            type="hidden"
            label="Id"
            name="id"
            required
            minLength={3}
            maxLength={255}
            value={cliente?.clienteId as undefined}
        />
        <Input
            type="text"
            label="Nome completo"
            name="nome"
            required
            minLength={3}
            maxLength={255}
            value={cliente?.nomeCompleto ?? ""}
        />
        <Input
            type="cpf"
            label="CPF"
            name="cpf"
            required
            value={cliente?.cpf ?? ""}
        />
        <Input
            type="email"
            label="E-mail"
            name="email"
            required
            value={cliente?.email ?? ""}
        />
        <Input
            type="tel"
            label="Telefone"
            name="telefone"
            required
            value={cliente?.telefone ?? ""}
        />
        <Input
            type="date"
            label="Data de nascimento"
            name="nascimento"
            required
            value={cliente?.nascimento ?? ""}
        />
    </FormModal>
  );
}
