import React, {useEffect, useState} from 'react';
import './style.css';
import {P} from "../../../text/P";

type RadioProps = {
    children?: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    onClick?: () => void;
    selected?: boolean;
};

export function Radio({
                          children,
                          size = 'medium',
                          disabled = false,
                          selected = false,
                          onClick = () => {} }: RadioProps) {
  const [isChecked, setIsChecked] = useState(selected);

    const handleOnChange = () => {
    if (!disabled && !selected) {
      setIsChecked(!isChecked);
      onClick();
    }
    };

    useEffect(() => {
        if (selected !== isChecked) {
            setIsChecked(selected);
        }
        if (disabled) {
            setIsChecked(false);
        }
    }, [selected, disabled]);

  return (
    <label className={`radio-container ${size} ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleOnChange}
        disabled={disabled}
        className="radio-input"
      />
      <span className="radio-checkmark"></span>
        <P
            variant={"xlarge"}
            align={"middle"}
            justify={"right"}
            color={isChecked ? "green" : "black"}
            bold={isChecked}
            uppercase={true}
        >
            {children}
        </P>
    </label>
  );
}
