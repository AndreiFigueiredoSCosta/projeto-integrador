import React from "react";
import DropdownContext from "../contexts/dropdown/DropdownContext";

/**
 * Hook usado para acessar dados de pesquisa
 */
export default function useDropdown(){
    const context = React.useContext(DropdownContext);

    if (!context){
        throw new Error('useSearch must be used within a DropdownProvider');
    }

    return context;
}
