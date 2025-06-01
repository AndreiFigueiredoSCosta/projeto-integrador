import React from "react";
import {ViewTrader} from "../../misc/ViewTrader";
import useView from "../../../hooks/useView.ts";
import SubmitContainerButton from "../../buttons/misc/SubmitContainerButton";

import "./style.css";
import ViewProperties from "../../../models/view/ViewProperties.ts";

type ViewManagerProps = {
    hasSubmitContainer?: boolean;
    upperButtons?: React.ReactNode;
    size?: "small" | "large";
    submitBtnText?: string;
}

/**
 * Componente que gerencia as views de um contexto
 * @param hasSubmitContainer - Define se o botão de submit container deve ser renderizado
 * @param upperButtons - Componente que será renderizado acima do botão de submit container
 * @param size - Tamanho do componente
 * @param submitBtnText - Texto do botão de submit
 * @constructor
 */
export default function ViewManager({ hasSubmitContainer = true, upperButtons = null, size = "large", submitBtnText = "Cadastrar" } : ViewManagerProps ){
    const context = useView();
    const vtSize = size === "small" ? "medium" : size;

    // Function to handle the click event on the ViewTrader component
    const handleClick = (view: ViewProperties) => {
        context.setCurrentView(view);
    }

    // VTAux component to render the ViewTrader component if the name is not null
    const VTAux = ({view, isUnique = false} : {view?: ViewProperties, isUnique?: boolean}) => {
        return (
            <>
                {
                    (view && !isUnique) &&
                    <ViewTrader disabled={!(context.currentView.title === view.title)}
                                size={vtSize}
                                onClick={() => handleClick(view || ({} as ViewProperties))}
                    >
                        {view.title}
                    </ViewTrader>
                }
            </>
        );
    }

    return (
        <div className={"view-manager"}>
            <div className={"view-traders"}>
                <VTAux view={context.views.primary} isUnique={!context.views.secondary && size === "large"}/>
                <VTAux view={context.views.secondary}/>
                <VTAux view={context.views.tertiary}/>
            </div>

            <div className={"upper-buttons"}>
                {
                    hasSubmitContainer &&
                    <SubmitContainerButton size={size} submitText={submitBtnText}/>
                }

                {
                    upperButtons
                }
            </div>
        </div>
    );
}
