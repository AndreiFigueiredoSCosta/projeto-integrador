import {SelectOption} from "../../../../types/SelectOption.ts";
import {CSSProperties, useEffect, useState} from "react";
import {useFetch} from "../../../../hooks/useFetch.ts";
import {useErrorHandling} from "../../../../hooks/useErrorHandling.ts";
import {Select} from "../Select";
import {P} from "../../../text/P";

type RequestSelectProps = {
    endpoint: (inputValue: string) => string;
    selected?: SelectOption | null;
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    onSelect?: (value: SelectOption | null) => void;
    type?: "on-click" | "on-input";
    minInputLength?: number;
    style?: CSSProperties;
}

export default function RequestSelect({
                                          endpoint,
                                          selected = null,
                                          required = false,
                                          disabled = false,
                                          name,
                                          value,
                                          onSelect = () => {},
                                          onChange = () => {},
                                          minInputLength = 3,
                                          type = "on-input",
                                          style,
                                          label }
                                          : RequestSelectProps) {
    const [ input, setInput ] = useState<string>(value || "");
    const [ options, setOptions ] = useState<SelectOption[]>([]);
    const { toggleRequest, data, isLoading, error, isError } = useFetch<SelectOption>(endpoint(input));

    const handleClick = () => {
        if (type === "on-click"){
            toggleRequest();
        }
    }

    useEffect(() => {
        if (type === "on-input"){
            if (input.length >= minInputLength){
                toggleRequest();
            }
            else if (input.length < minInputLength){
                return setOptions([]);
            }
        }
    }, [input, type, minInputLength]);

    useEffect(() => {
        if (data){
            setOptions(data as SelectOption[]);
        }
    }, [data, input, minInputLength]);

    useErrorHandling(isError, error, "Erro ao carregar opções!");

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                width: "100%"
            }}
        >
            <Select
                label={`${label}`}
                name={name}
                required={required}
                options={options}
                inputValue={input}
                value={selected}
                isLoading={isLoading}
                disabled={disabled}
                onChange={(value) => {
                    onSelect(value);
                }}
                onInputChange={(value) => {
                    setInput(value);
                    onChange(value);
                }}
                onClick={handleClick}
                style={style}
            />
            {
                (input.length < minInputLength && input != "") &&
                <P
                    variant={"xsmall"}
                    color={"gray"}
                    justify={"center"}
                    align={"middle"}
                    style={{
                        position: "absolute",
                        top: "35px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "var(--branco)",
                        minWidth: "100%",
                        padding: "3px",
                        borderRadius: "5px",
                        zIndex: 1,
                        border: "1px solid var(--cinza)"
                }}>
                    Mínimo de {minInputLength} caracteres
                </P>
            }
        </div>
    );
}
