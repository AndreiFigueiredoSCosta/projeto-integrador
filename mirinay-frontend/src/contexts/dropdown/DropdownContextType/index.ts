import React from "react";

/**
 * Interface de todas a propriedades do contexto de view
 */
export default interface DropdownContextType {
    isDropdownOpen: boolean;
    setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    refreshDropdown: () => void;
    rowRefresh: boolean;
}
