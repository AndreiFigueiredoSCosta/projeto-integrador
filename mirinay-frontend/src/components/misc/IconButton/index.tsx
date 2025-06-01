import React, {ReactNode, useEffect, useState} from 'react';
import './style.css';
import {Pencil} from "../../../assets/buttons/Pencil";
import {Trash} from "../../../assets/buttons/Trash";
import {Comment} from "../../../assets/buttons/Comment";
import {Dislike} from "../../../assets/buttons/Dislike";
import {Like} from "../../../assets/buttons/Like";

interface IconButtonProps {
    variant: 'edit' | 'delete' | 'comment' | 'like' | 'dislike';
    size: 'small' | 'large';
    onClick?: () => void;
    selected?: boolean;
    disabled?: boolean;
}



const IconButton: React.FC<IconButtonProps> = ({
                                                   variant,
                                                   size,
                                                   onClick,
                                                   selected = false,
                                                   disabled = false
                                               }) => {
    const [ element, setElement ] = useState<ReactNode>(null);

    useEffect(() => {
        switch (variant) {
            case 'edit':
                setElement(<Pencil size={size} />);
                break
            case 'delete':
                setElement(<Trash size={size} />);
                break
            case 'comment':
                setElement(<Comment size={size} />);
                break
            case 'like':
                setElement(<Like size={size} />);
                break
            case 'dislike':
                setElement(<Dislike size={size} />);
                break
        }
    }, [variant, setElement]);

    return (
        <button
            className={`
            icon-button
            icon-button-${variant}
            ${selected && 'icon-button-selected'}
            `}
            onClick={onClick}
            disabled={disabled}
        >
            {element}
        </button>
    );
};

export default IconButton;
