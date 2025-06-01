import ViewManager from "../../../../../components/view/ViewManager";
import {useEffect, useState} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import FornecedorView from "../views/FornecedorView/index.tsx";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";

/**
 * Gerencia a view de Produto
 * @constructor
 */
export default function FornecedorSummary(){
    const { setCurrentView, addView } = useView();
    const { addSearchView } = useSearch();
    const [ hasLoaded, setHasLoaded ]  = useState<boolean>(false);

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!hasLoaded) {
            const primaryView = defaultViewProperties as ViewProperties;

            primaryView.title = "Fornecedor";

            addView(primaryView);

            addSearchView("Código do fornecedor", useEndpoint().fornecedor().search().id);
            addSearchView("Nome do fornecedor", useEndpoint().fornecedor().search().nome);
            addSearchView("Código do CNPJ", useEndpoint().fornecedor().search().cnpj().id);
            addSearchView("Nome fantasia do CNPJ", useEndpoint().fornecedor().search().cnpj().nome);
            addSearchView("CNPJ do fornecedor", useEndpoint().fornecedor().search().cnpj().cnpj);

            setCurrentView(primaryView);
            setHasLoaded(true); //usado para impedir um looping infinito
        }
    }, [addView, hasLoaded, setCurrentView]);

    return (
        <SummaryContainer title={"Fornecedor"}>
            <ViewManager hasSubmitContainer={true} size={"large"}/>
            <FornecedorView/>
        </SummaryContainer>
    );
}
