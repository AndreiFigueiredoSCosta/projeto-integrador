import './style.css';
import SearchIcon from '../../../../assets/SearchIcon';
import * as React from "react";

type PropsType = {
    children? : React.ReactNode,
    onClick?: () => void,
    disabled?: boolean
}

export function SearchButton ( {
                                   children,
                                   onClick,
                                   disabled } : PropsType ) {
    return (
        <button type={"submit"} className={ `search-button` } disabled={disabled} onClick={onClick}>
            {children}
            <SearchIcon />
        </button>
    );
}
