import { useState, useEffect } from 'react';
import ReactSelect, { MultiValue } from 'react-select';
import { Label } from '../../components/Label';
import './style.css';
import {SelectOption} from "../../../../types/SelectOption.ts";
import {RequiredElement} from "../../components/RequiredElement";

interface MultiselectProps {
  label: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  value?: SelectOption[];
}

export function Multiselect({ label, options, required = false, disabled = false, value = [] }: MultiselectProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(value);

  const isFilled = selectedOptions.length > 0;

  const handleChange = (newValue: MultiValue<SelectOption>) => {
    setSelectedOptions(newValue as SelectOption[]);
  };

  useEffect(() => {
    setSelectedOptions(value);
  }, [value]);

  return (
    <div className="input-container">
      <ReactSelect
        inputId="custom-multiselect"
        classNamePrefix="custom-multiselect"
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isDisabled={disabled}
        placeholder=""
        isMulti
        className="multiselect-input"
      />
        <Label htmlFor="custom-multiselect" elementFilled={isFilled} disabled={disabled}>
            <RequiredElement isRequired={required}/>
            {label}
        </Label>
    </div>
  );
}
