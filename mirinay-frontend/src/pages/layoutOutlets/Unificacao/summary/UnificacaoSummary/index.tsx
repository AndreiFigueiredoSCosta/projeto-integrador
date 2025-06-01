import ViewManager from "../../../../../components/view/ViewManager";
import {createContext, useEffect, useState} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import UnificacaoView from "../views/UnificacaoView";
import {ActionButton} from "../../../../../components/buttons/action/ActionButton";
import {UnificacaoResponseData} from "../../../../../models/unificacao/UnificacaoResponseData.ts";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";

export const CheckContext = createContext<{emptySelectedItens: boolean} | undefined>(undefined)


/**
 * Gerencia a view de Unificacao
 * @constructor
 */
export default function UnificacaoSummary(){
    const {setCurrentView, addView, currentView} = useView();
    const { addSearchView } = useSearch();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const itensView = {
                ...defaultViewProperties,
                title: "itens"
            } as ViewProperties;

            addView(itensView);

            addSearchView("Código do item", useEndpoint().unificacao().search().grupo().id);
            addSearchView("Nome do grupo", useEndpoint().unificacao().search().grupo().nome);
            addSearchView("Código do produto", useEndpoint().unificacao().search().produto().id);
            addSearchView("Nome do produto", useEndpoint().unificacao().search().produto().nome);

            setCurrentView(itensView);
        }
    }, [currentView, addView, setCurrentView]);

    const [ selectedItens, setSelectedItens ] = useState<number[] | undefined>([]);

    const handleSelect = (data: UnificacaoResponseData)=> {
        return setSelectedItens((prev) => {
            let isAlreadySelected = prev?.includes(data.itemId);
            if (!isAlreadySelected) {
                return [...(prev ?? []), data.itemId];
            }
            else{
                return prev?.filter((item) => item !== data.itemId);
            }
        });
    }

    return (
        <SummaryContainer title={"Unificação"}>
                <ViewManager
                    hasSubmitContainer={true}
                    size={"large"}
                    upperButtons={(
                        <ActionButton
                            variant={"delete"}
                            upper={true}
                            size={"large"}
                            onClick={() => {
                                setSelectedItens([]);
                            }}
                            disabled={selectedItens?.length === 0}
                        >
                            Limpar
                        </ActionButton>
                    )}
                    submitBtnText={"Unificar"}
                />
                <CheckContext.Provider value={{emptySelectedItens: selectedItens?.length === 0}}>
                    <UnificacaoView
                        handleSelect={handleSelect}
                        selectedItens={selectedItens}
                        setSelectedItens={setSelectedItens}
                    />
                </CheckContext.Provider>
        </SummaryContainer>
    );
}
