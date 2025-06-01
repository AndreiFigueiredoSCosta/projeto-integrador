import React from 'react';
import './style.css';
import ArrowLeft from '../../../../assets/ArrowLeft';

interface ReturnButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    value?: string;
    type?: 'button' | 'submit' | 'reset';
    children?: React.ReactNode;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({
    onClick,
    disabled = false,
    value = '',
    type = 'button',
    children}) => {

    return (
        <button
            className={`return-button`}
            onClick={onClick}
            type={type}
            value={value}
            disabled={disabled}
        >
            <ArrowLeft/>
            {children}
        </button>
    );
};

export default ReturnButton;
