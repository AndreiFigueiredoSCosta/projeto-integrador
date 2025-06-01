import './style.css';
import {NavButtonIcon} from "../../../../assets/NavButtonIcon";

type NavButtonProps = {
    onClick?: (value: string) => void;
    disabled?: boolean;
    value?: string;
    variant: "left" | "right";
};

export function NavButton({ onClick, disabled = false, value = "", variant}: NavButtonProps) {
    return (
        <button
            className={`nav-button ${variant}`}
            onClick={(e) => onClick?.((e.target as HTMLButtonElement).value)}
            value={value}
            disabled={disabled}
        >
            <NavButtonIcon/>
        </button>
    );
}
