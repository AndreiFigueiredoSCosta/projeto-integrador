import {FC, InputHTMLAttributes, ReactNode, useEffect, useState} from 'react';
import './style.css';

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
    onClick?: () => void;
    children?: ReactNode;
    name: string;
    required?: boolean;
    disabled?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
}


const Switch: FC<SwitchProps> = ({
                                     onClick = () => {},
                                     children,
                                     name,
                                     checked = false,
                                     required = false,
                                     disabled = false }) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked, setIsChecked]);
  return (
      <>
          <input
              type="checkbox"
              className="switch-input"
              onClick={() => {
                  onClick()
                  setIsChecked(!isChecked)
              }}
              disabled={disabled}
              name={name}
              id={`${name}ID`}
              checked={isChecked}
              required={required}
          />
          <label className="switch" htmlFor={`${name}ID`}>
              <span className="switch-ball"></span>
              {children && <span className="switch-text">{children}</span>}
          </label>
      </>
  );
};

export default Switch;