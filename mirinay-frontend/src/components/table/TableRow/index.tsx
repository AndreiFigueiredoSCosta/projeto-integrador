import './styles.css'
import React, {useCallback, useState} from 'react';
import {ArrowIcon} from '../../../assets/ArrowIcon';

type TableRowProps = {
    children?: React.ReactNode,
    dropdown?: boolean,
    stripped?: boolean,
    content?: React.ReactNode,
    onClick?: () => void,
    selected?: boolean,
    rejected?: boolean,
    approved?: boolean,
    removed?: boolean,
    noClickDropdown?: boolean
};

/**
 * Componente TableRow
 * @param children - Conteúdo do TableRow
 * @param dropdown - Se o TableRow deve ter um dropdown
 * @param content - Conteúdo do dropdown
 * @param state - Estado do TableRow, default ou stripped
 * @param onClick - Função a ser realizada ao clicar no TableRow
 */
export function TableRow({
                             children,
                             dropdown = false,
                             noClickDropdown = false,
                             stripped = false,
                             content,
                             onClick,
                             selected = false,
                             rejected = false,
                             approved = false,
                             removed = false
                         }
                             : TableRowProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
        if (dropdown) {
            setIsOpen(!isOpen);
            if (onClick)
            onClick();
        }
    }, [dropdown, onClick, isOpen]);


    return (
        <>
            <div
                className={`tableRow
                ${dropdown && 'dropdown-tableRow'}
                ${stripped && "stripped-tableRow"}
                ${isOpen && 'dropdown-clicked'}
                ${selected && 'selected-tableRow'}
                ${rejected && 'rejected-tableRow'}
                ${approved && 'approved-tableRow'}
                ${removed && 'removed-tableRow'}
                ${noClickDropdown && 'no-click-dropdown-tableRow'}
                `}
                onClick={() => {
                    if (!noClickDropdown)
                    toggleDropdown();
                }}
                style={{cursor: dropdown ? 'pointer' : 'default'}}
            >
                {(dropdown && !noClickDropdown) && <ArrowIcon clicked={isOpen}/>}
                {children}
            </div>
            {dropdown && (
                <div className={`dropdown-content ${isOpen && 'open'}`}>
                    {content}
                </div>
            )}
        </>
    );
}
