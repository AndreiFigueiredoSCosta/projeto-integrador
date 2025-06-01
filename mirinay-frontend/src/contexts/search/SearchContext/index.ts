import {createContext} from "react";
import SearchContextType from "../SearchContextType";

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export default SearchContext;
