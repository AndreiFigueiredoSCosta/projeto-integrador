import './style.css'
import { Bar } from "../components/Bar";
import {ReactNode, useEffect, useRef, useState} from "react";

interface TableContainerProps {
    children?: ReactNode;
    barContent?: ReactNode;
    size?: "small" | "large";
}

export function TableContainer({ children, barContent, size = "large" }: TableContainerProps) {
    const tabela = useRef<HTMLDivElement>(null);
    const [offsetTop, setOffsetTop] = useState<number>(0);

    useEffect(() => {
        if (tabela.current) {
            const rect = tabela.current.getBoundingClientRect();
            setOffsetTop(rect.top + window.scrollY);
        }
    }, []);

    return (
        <div className="table-container observed-div">
            <Bar variant={"upper"} size={size}>
                {barContent}
            </Bar>
            <div
                className="table"
                ref={tabela}
                style={{
                    maxHeight: `calc(100vh - ${(offsetTop+30)+(size === "small" ? 25 : 0)}px)`
                }}>
                {children}
            </div>
            <Bar variant={"lower"} size={size}/>
        </div>
    );
}
