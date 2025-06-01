import {ReactNode, useCallback, useState} from "react";
import DetailsContext from "../DetailsContext";

export default function DetailsProvider({children}: {children: ReactNode}){
    const [ data, setData ] = useState<unknown | undefined>(undefined);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ globalRefresh, setGlobalRefresh ] = useState<boolean>(false);

    const refreshDetails = useCallback(function refreshView() {
        return setTimeout(() => {
            return setGlobalRefresh((prevState) => {
                return !prevState;
            });
        }, 0);
    }, []);

    return (
        <DetailsContext.Provider value={{data, setData, isLoading, setIsLoading, refreshDetails, globalRefresh }}>
            {children}
        </DetailsContext.Provider>
    );
}
