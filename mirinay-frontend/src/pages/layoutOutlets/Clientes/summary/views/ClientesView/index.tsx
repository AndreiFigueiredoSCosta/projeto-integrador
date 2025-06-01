import ViewContainer from "../../../../../../components/view/ViewContainer";
import ClientesTable from "../../tables/ClientesTable";
import ClientesSubmitForm from "../../forms/ClientesSubmitForm";

/**
 * Gerencia a comunicação entre os componentes da view de Grupo
 * @constructor
 */
export default function ClientesView(){
    return (
        <ViewContainer>
            <ClientesTable />
            <ClientesSubmitForm />
        </ViewContainer>
    );
}
