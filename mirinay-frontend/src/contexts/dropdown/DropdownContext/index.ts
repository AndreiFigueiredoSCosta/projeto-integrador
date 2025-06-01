import {createContext} from "react";
import DropdownContextType from "../DropdownContextType";

const DropdownContext = createContext<DropdownContextType | undefined>(undefined)

export default DropdownContext;
