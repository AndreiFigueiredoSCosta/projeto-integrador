import ViewManager from "../../../../../components/view/ViewManager";
import {useEffect, useState} from "react";
import useView from "../../../../../hooks/useView.ts";
import ProdutoView from "../views/ProdutoView/index.tsx";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";

/**
 * Gerencia a view de Produto
 * @constructor
 */
export default function ProdutoSummary(){
    const { setCurrentView, addView } = useView();
    const { addSearchView } = useSearch();
    const [ hasLoaded, setHasLoaded ]  = useState<boolean>(false);

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!hasLoaded) {
            // Adiciona a view de Produto
            const produtoView = defaultViewProperties as ViewProperties;

            produtoView.title = "Produto";

            addView(produtoView);
            setCurrentView(produtoView);

            // Adiciona as views de pesquisa
            addSearchView("Código do Produto", useEndpoint().produto().search().id);
            addSearchView("Nome do Produto", useEndpoint().produto().search().nome);
            addSearchView("Referencia", useEndpoint().produto().search().referencia);

            setHasLoaded(true); //usado para impedir um looping infinito
        }
    }, [addView, addSearchView, hasLoaded, setCurrentView]);

    return (
        <SummaryContainer title={"Produto"}>
                <ViewManager hasSubmitContainer={true} size={"large"}/>
                <ProdutoView/>
        </SummaryContainer>
    );
}
