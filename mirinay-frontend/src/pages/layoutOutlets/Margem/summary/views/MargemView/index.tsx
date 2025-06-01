import ViewContainer from "../../../../../../components/view/ViewContainer";
import MargemTable from "../../tables/MargemTable";
import MargemSubmitForm from "../../forms/MargemSubmitForm";

/**
 * Gerencia a comunicação entre os componentes da view de Grupo
 * @constructor
 */
export default function MargemView(){
    return (
        <ViewContainer>
            <MargemTable />
            <MargemSubmitForm />
        </ViewContainer>
    );
}
