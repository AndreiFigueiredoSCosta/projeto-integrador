import {ReactNode, useCallback, useState} from "react";
import DropdownContext from "../DropdownContext";

/**
 * Providencia propriedades padrões para até 3 views
 * @param children
 * @constructor
 */
export default function DropdownProvider({children} : {children?: ReactNode}){
    const [ isDropdownOpen, setIsDropdownOpen ] = useState<boolean>(false);
    const [ rowRefresh, setRowRefresh ] = useState<boolean>(false)


    const refreshDropdown = useCallback(function refreshView() {
        return setTimeout(() => {
            return setRowRefresh((prevState) => {
                return !prevState;
            });
        }, 0);
    }, [setRowRefresh]);

    return (
        <DropdownContext.Provider value={{
            isDropdownOpen,
            setIsDropdownOpen,
            refreshDropdown,
            rowRefresh
            }}>
            {children}
        </DropdownContext.Provider>
    );
}
