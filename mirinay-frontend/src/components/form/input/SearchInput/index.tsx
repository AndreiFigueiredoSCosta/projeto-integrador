import '../../style/style.css';
import './style.css';

import { SearchButton } from "../../../buttons/input/SearchButton";
import Input from "../Input";
import {useEffect, useState} from "react";

type PropsType = {
    label: string;
    name: string;
    value?: string;
    disabled?: boolean;
    btnDisabled?: boolean;
    onChange?: (value: string) => void;
    onSubmit?: () => void;
    required?: boolean;
    minToSearch?: number;

};

/**
 * Componente usado para inputs de pesquisa
 * @param label - label do input
 * @param name - nomeFantasia do input
 * @param value - valor atual do ‘input’
 * @param disabled - se o input está desabilitado
 * @param btnDisabled
 * @param onChange - função para chamar quando o valor do input muda
 * @param onBtnClick
 * @param required - se o input é obrigatório
 * @param minToSearch
 * */
export function SearchInput({ label,
                                name,
                                value = "",
                                disabled = false,
                                btnDisabled = false,
                                onChange = (value: string) => {},
                                onSubmit = () => {},
                                required = false,
                                minToSearch = 3
                                }
                                : PropsType ) {
    const [ inputValue, setInputValue ] = useState<string>(value);
    useEffect(() => {

    }, []);

    return (
        <div className="search-form">
            <Input
                type={"search"}
                label={label}
                name={name}
                onChange={(e) => {
                    setInputValue(e);
                    onChange(e);
                }}
                value={inputValue}
                disabled={disabled}
                required={required}
                onEnterClick={onSubmit}
            />
            <SearchButton disabled={inputValue.length < minToSearch || disabled || btnDisabled} onClick={onSubmit} />
        </div>
    );
}
