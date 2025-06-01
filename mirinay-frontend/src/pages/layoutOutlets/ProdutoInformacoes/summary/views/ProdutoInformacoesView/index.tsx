import ViewContainer from "../../../../../../components/view/ViewContainer";
import MarcaSubmitForm from "../../forms/MarcaSubmitForm";
import useView from "../../../../../../hooks/useView.ts";
import {P} from "../../../../../../components/text/P";
import UnidadeTable from "../../tables/UnidadeTable";
import UnidadeSubmitForm from "../../forms/UnidadeSubmitForm";
import MarcaTable from "../../tables/MarcaTable";
import SearchProvider from "../../../../../../contexts/search/SearchProvider";

/**
 * Gerencia a comunicação entre os componentes da view das informações de produto
 * @constructor
 */
export default function ProdutoInformacoesView(){
    const {currentView} = useView();

    switch (currentView.title) {
        case "unidade":
            return (
                <SearchProvider>
                    <ViewContainer>
                        <UnidadeTable />
                        <UnidadeSubmitForm />
                    </ViewContainer>
                </SearchProvider>
            );
        case "marca":
            return (
                <ViewContainer>
                    <MarcaTable />
                    <MarcaSubmitForm />
                </ViewContainer>
            );
        default:
            return (
                <P>ERRO! VIEW NÃO ENCONTRADA</P>
            );
    }
}
