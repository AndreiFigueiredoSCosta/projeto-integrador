import React, {useEffect, useState} from 'react';
import './style.css';

type CheckboxProps = {
    children?: React.ReactNode,
    size: 'small' | 'medium' | 'large',
    disabled?: boolean,
    checked?: boolean,
    onClick?: () => void,
    resetCheck?: boolean
};

export function Checkbox({
                             children,
                             size,
                             disabled = false,
                             checked = false,
                             onClick = () => {},
                             resetCheck = false
                         }: CheckboxProps) {
    const [isChecked, setIsChecked] = useState(checked);

    const handleOnChange = () => {
        if (!disabled) {
            onClick();
            setIsChecked(!isChecked);
        }
    };

    useEffect(() => {
        if (resetCheck) {
            setIsChecked(false);
        }
    }, [resetCheck]);

    return (
        <label className={`checkbox-container ${size} ${disabled ? 'disabled' : ''}`}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleOnChange}
                disabled={disabled}
                className="checkbox-input"
            />
            <span className="checkbox-checkmark"/>
            {children}
        </label>
    );
}
