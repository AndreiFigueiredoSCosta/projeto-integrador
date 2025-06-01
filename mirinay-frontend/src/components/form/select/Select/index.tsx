import {CSSProperties, useEffect, useState} from 'react';
import ReactSelect from 'react-select';
import { Label } from '../../components/Label';
import './style.css';
import {SelectOption} from "../../../../types/SelectOption.ts";
import {RequiredElement} from "../../components/RequiredElement";

interface SelectProps {
  label: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  value?: SelectOption | null;
  name: string;
  onClick?: () => void;
  isLoading?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onChange?: (value: SelectOption | null) => void;
  style?: CSSProperties;
    isSearchable?: boolean;
}

export function Select({
                           label,
                           options,
                           required = false,
                           disabled = false,
                           value,
                           name,
                           onClick = () => {},
                           onChange = () => {},
                           isLoading,
                           isSearchable = true,
                           inputValue = undefined,
                           onInputChange = () => {},
                           style
                       }
                           : SelectProps) {
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>();
  const [ selectValue, setSelectValue ] = useState<string>();
  const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
        setSelectedOption(value || null);
    }, [value]);

    useEffect(() => {
        setSelectValue(inputValue || "");
    }, [inputValue]);

  return (
    <div className="input-container" onClick={onClick} style={style}>
      <ReactSelect
        inputId={`${name}ID`}
        name={name}
        options={options}
        required={required}
        value={selectedOption}
        onChange={(newValue) => {
            setSelectedOption(newValue);
            onChange(newValue);
        }}
        isDisabled={disabled}
        isLoading={isLoading}
        placeholder=""
        isClearable={true}
        onInputChange={(newValue) => {
            setSelectValue(newValue);
            onInputChange(newValue);
        }}
        escapeClearsValue={false}
        inputValue={selectValue}
        menuPosition={"fixed"}
        isSearchable={isSearchable}
        onFocus={() => {
            return setIsFocused(true);
        }}
        onBlur={() => {
            return setIsFocused(false);
        }}
        styles={{
            container: (base) => ({
                ...base,
                width: "100%",
                height: "100%",
            }),
            control: (base) => ({
                ...base,
                height: "100%",
                width: "100%",
                backgroundColor: "var(--branco)",
            }),
            input: (base) => ({
                ...base,
                padding: "8px 0 0 10px",
                fontSize: "12px"
            }),
            singleValue: (base) => ({
                ...base,
                padding: "8px 0 0 10px",
                fontSize: "12px",
                fontWeight: 500
            })
        }}
      />
        <Label htmlFor={`${name}ID`} elementFilled={!!selectValue || !!selectedOption || isFocused} disabled={disabled}>
            <RequiredElement isRequired={required} />
            {label}
        </Label>
    </div>
  );
}
