import React from "react";
import ProviderViews from "../../../models/view/ProviderViews.ts";
import ViewProperties from "../../../models/view/ViewProperties.ts";

/**
 * Interface de todas a propriedades do contexto de view
 */
export default interface ViewContextType {
    views: ProviderViews;
    addView: (view: ViewProperties) => void;
    currentView: ViewProperties;
    setCurrentView: React.Dispatch<React.SetStateAction<ViewProperties>>;
    isSubmitContainerVisible: boolean;
    setIsSubmitContainerVisible: React.Dispatch<React.SetStateAction<boolean>>;
    viewItens: number;
    setViewItens: (itens: number) => void;
    canNavLeft: boolean;
    setCanNavLeft: React.Dispatch<React.SetStateAction<boolean>>;
    canNavRight: boolean;
    setCanNavRight: React.Dispatch<React.SetStateAction<boolean>>;
    refresh: boolean;
    refreshView: () => void;
    maxItens: number;
    setMaxItens: React.Dispatch<React.SetStateAction<number>>;
}
