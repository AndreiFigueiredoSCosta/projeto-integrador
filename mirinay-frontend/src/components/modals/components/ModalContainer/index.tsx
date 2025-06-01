import React from 'react';
import './style.css';

/**
 * @param children - Componente React que ficará dentro do modal
 * @param hide - Define a visibilidade do modal
 *
 */

type Props = {
    children: React.ReactNode | null,
    hide: boolean,
    setHide: React.Dispatch<React.SetStateAction<boolean>>
}

export function ModalContainer({children, hide, setHide}: Props) {

    if (hide || !children) return null;

    return (
        <div className="ModalContainer-overlay" onClick={() => {
            setHide((prevstate) => {
                return !prevstate
            })
        }}>
            <div className="ModalContainer-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>

    );
};

