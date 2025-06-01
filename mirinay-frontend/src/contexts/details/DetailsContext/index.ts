import {createContext} from "react";
import DetailsContextType from "../DetailsContextType";

const DetailsContext = createContext<DetailsContextType | undefined>(undefined);

export default DetailsContext;
