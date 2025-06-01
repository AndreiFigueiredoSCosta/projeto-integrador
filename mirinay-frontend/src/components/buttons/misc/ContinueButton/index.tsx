import React from 'react';
import './style.css';
import ArrowRight from '../../../../assets/ArrowRight';

interface ContinueButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    value?: string;
    type?: 'button' | 'submit' | 'reset';
    children?: React.ReactNode;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
    onClick,
    disabled = false,
    value = '',
    type = 'button',
    children}) => {

    return (
        <button
            className={`continue-button`}
            onClick={onClick}
            type={type}
            value={value}
            disabled={disabled}
        >
            {children}
            <ArrowRight/>
        </button>
    );
};

export default ContinueButton;
