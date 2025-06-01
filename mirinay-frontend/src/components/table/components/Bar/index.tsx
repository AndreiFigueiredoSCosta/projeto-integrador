import './style.css'
import {ReactNode} from "react";

interface BarProps {
    variant: "upper" | "lower";
    size: "small" | "large";
    children?: ReactNode;
}

export function Bar( {variant, size, children} : BarProps ) {
    return (
        <div className={`bar ${variant}-bar ${size}-bar`}>
            {children}
        </div>
    )
}
