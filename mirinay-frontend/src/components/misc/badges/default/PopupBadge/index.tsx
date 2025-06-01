import './style.css';
import {ReactNode, useEffect, useState, useRef} from "react";
import {P} from "../../../../text/P";

type StageBadgeProps = {
    badgeText?: ReactNode;
    children?: ReactNode;
    enabledPopup?: boolean;
    disabled?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

/**
 * Componente usado para indicar o estágio atual de algo
 * @param children - Conteúdo da badge.
 * @param enabledPopup
 * @param popupContent
 * @param disabled
 */

export function PopupBadge({
                               children,
                               enabledPopup = true,
                               onMouseEnter = () => {},
                               onMouseLeave = () => {},
                               badgeText,
                               disabled
}: StageBadgeProps) {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isPopupHovered, setIsPopupHovered] = useState<boolean>(false);
    const [isBadgeHovered, setIsBadgeHovered] = useState<boolean>(false);
    const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('bottom');
    const badgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isPopupHovered && !isBadgeHovered) {
            setTimeout(() => {
                if (!isPopupHovered && !isBadgeHovered)
                    setIsHovered(false);
            }, 50);
        } else {
            if (!isHovered && (isPopupHovered || isBadgeHovered)) {
                setIsHovered(true);
            }
        }
    }, [isPopupHovered, isBadgeHovered, setIsHovered, isHovered]);

    useEffect(() => {
        if (isHovered && badgeRef.current) {
            const rect = badgeRef.current.getBoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 150 && spaceAbove > spaceBelow) {
                setPopupPosition('top');
            } else {
                setPopupPosition('bottom');
            }
        }
    }, [isHovered]);

    return (
        <div className={`popup-badge-container`}
             ref={badgeRef}
             onMouseOver={() => {
                if (!disabled && !isHovered) {
                    onMouseEnter();
                    setIsBadgeHovered(true);
                }
             }}
             onMouseOut={() => {
                if (!disabled && isHovered) {
                    onMouseLeave();
                    setIsBadgeHovered(false);
                }
             }}
        >
            <div className={`popup-badge ${disabled && `disabled-popup-badge`}`}>
                <P variant={"small"}
                   align={"middle"}
                   uppercase={true}
                   color={"blank"}
                   justify={"center"}
                   style={{fontWeight: '600', wordBreak: "keep-all"}}
                >
                    {badgeText}
                </P>
            </div>
            {
                (enabledPopup && isHovered) &&
                <div
                    className={`popup-badge-content ${popupPosition === 'top' ? 'popup-top' : 'popup-bottom'}`}
                    onMouseEnter={() => setIsPopupHovered(true)}
                    onMouseLeave={() => setIsPopupHovered(false)}
                >
                    {children}
                </div>
            }
        </div>
    );
}
