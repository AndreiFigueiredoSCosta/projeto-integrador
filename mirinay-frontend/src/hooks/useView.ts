import React from "react";
import ViewContext from "../contexts/view/ViewContext";

/**
 * Hook usado para acessar dados de visualização.
 */
export default function useView(){
    const context = React.useContext(ViewContext);

    if (!context){
        throw new Error('useView must be used within a ViewProvider');
    }

    return context;
}
