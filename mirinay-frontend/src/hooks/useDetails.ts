import DetailsContext from "../contexts/details/DetailsContext";
import {useContext} from "react";

/**
 * Hook usado para acessar dados de detalhes.
 */
export default function useDetails(){
    const context = useContext(DetailsContext);

    if (!context) {
        throw new Error('useDetails must be used within a DetailsProvider');
    }

    return context;
}
